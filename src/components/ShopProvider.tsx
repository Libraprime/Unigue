"use client";

// Bag + favourites state for the current Firebase user (guest or account).
// Data model and rationale: docs/ARCHITECTURE.md and
// docs/adr/0004-catalog-and-user-data-layer.md
//
//   users/{uid}/cart/{productId}       { productId, quantity, updatedAt }
//   users/{uid}/favorites/{productId}  { productId, addedAt }
//
// Firestore's local cache applies writes to the snapshot listeners
// immediately, so the UI is optimistic without extra state here.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useFirebase } from "./FirebaseProvider";
import { MAX_QTY, type CartLine } from "./lib/guest";
import { getProduct } from "./lib/product";

interface ShopContextValue {
  /** False until the first Firestore snapshots for the current user have arrived (avoids an "empty bag" flash). */
  loaded: boolean;
  cart: CartLine[];
  /** Total units in the bag (sum of quantities) — what the navbar badge shows. */
  cartCount: number;
  favorites: number[];
  addToBag: (productId: number, quantity?: number) => Promise<void>;
  setQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromBag: (productId: number) => Promise<void>;
  toggleFavorite: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
}

const EMPTY_CART: CartLine[] = [];
const EMPTY_FAVS: number[] = [];
const noop = async () => {};
const ShopContext = createContext<ShopContextValue>({
  loaded: false,
  cart: [],
  cartCount: 0,
  favorites: [],
  addToBag: noop,
  setQuantity: noop,
  removeFromBag: noop,
  toggleFavorite: noop,
  isFavorite: () => false,
});

export const useShop = () => useContext(ShopContext);

export default function ShopProvider({ children }: { children: ReactNode }) {
  const { db, currentUser } = useFirebase();
  const uid = currentUser?.uid;

  // Each snapshot remembers which user it belongs to, so after a sign-in or
  // sign-out the previous user's data is ignored instead of flashing.
  const [cartState, setCartState] = useState<{ uid: string; lines: CartLine[] } | null>(null);
  const [favState, setFavState] = useState<{ uid: string; ids: number[] } | null>(null);
  const cart = cartState && cartState.uid === uid ? cartState.lines : EMPTY_CART;
  const favorites = favState && favState.uid === uid ? favState.ids : EMPTY_FAVS;

  // Subscribe to the current user's bag + favourites; re-subscribes when the user changes.
  useEffect(() => {
    if (!db || !uid) return;

    // On failure (most often rules not deployed — docs/SETUP.md) settle to an
    // empty state so pages don't spin forever.
    const onError = (settle: () => void) => (err: Error) => {
      console.error("Firestore listener error (are firestore.rules deployed? see docs/SETUP.md):", err);
      settle();
      toast.error("Couldn't load your bag and favourites.", { id: "shop-listener-error" });
    };

    const offCart = onSnapshot(
      collection(db, "users", uid, "cart"),
      (snap) =>
        setCartState({
          uid,
          lines: snap.docs
            .map((d) => ({
              productId: Number(d.data().productId ?? d.id),
              quantity: Number(d.data().quantity ?? 1),
            }))
            // Ignore lines for products that no longer exist in the catalog.
            .filter((l) => getProduct(l.productId)),
        }),
      onError(() => setCartState({ uid, lines: [] })),
    );
    const offFavs = onSnapshot(
      collection(db, "users", uid, "favorites"),
      (snap) =>
        setFavState({
          uid,
          ids: snap.docs.map((d) => Number(d.data().productId ?? d.id)).filter((id) => getProduct(id)),
        }),
      onError(() => setFavState({ uid, ids: [] })),
    );
    return () => {
      offCart();
      offFavs();
    };
  }, [db, uid]);

  const ensureConnected = useCallback((): boolean => {
    if (db && uid) return true;
    toast.error("Still connecting — please try again in a moment.");
    return false;
  }, [db, uid]);

  const writeQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!db || !uid) return;
      await setDoc(doc(db, "users", uid, "cart", String(productId)), {
        productId,
        quantity,
        updatedAt: serverTimestamp(),
      });
    },
    [db, uid],
  );

  const addToBag = useCallback(
    async (productId: number, quantity = 1) => {
      if (!ensureConnected()) return;
      const product = getProduct(productId);
      if (!product) return;
      const existing = cart.find((l) => l.productId === productId)?.quantity ?? 0;
      if (existing >= MAX_QTY) {
        toast.error(`You can only order up to ${MAX_QTY} of the same item.`);
        return;
      }
      try {
        await writeQuantity(productId, Math.min(existing + quantity, MAX_QTY));
        toast.success(`${product.name} added to bag`);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't update your bag. Please try again.");
      }
    },
    [cart, ensureConnected, writeQuantity],
  );

  const setQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!ensureConnected()) return;
      const clamped = Math.max(1, Math.min(quantity, MAX_QTY));
      try {
        await writeQuantity(productId, clamped);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't update your bag. Please try again.");
      }
    },
    [ensureConnected, writeQuantity],
  );

  const removeFromBag = useCallback(
    async (productId: number) => {
      if (!ensureConnected() || !db || !uid) return;
      try {
        await deleteDoc(doc(db, "users", uid, "cart", String(productId)));
      } catch (err) {
        console.error(err);
        toast.error("Couldn't update your bag. Please try again.");
      }
    },
    [db, uid, ensureConnected],
  );

  const toggleFavorite = useCallback(
    async (productId: number) => {
      if (!ensureConnected() || !db || !uid) return;
      const ref = doc(db, "users", uid, "favorites", String(productId));
      try {
        if (favorites.includes(productId)) {
          await deleteDoc(ref);
          toast("Removed from favourites");
        } else {
          await setDoc(ref, { productId, addedAt: serverTimestamp() });
          toast.success("Saved to favourites");
        }
      } catch (err) {
        console.error(err);
        toast.error("Couldn't update favourites. Please try again.");
      }
    },
    [db, uid, favorites, ensureConnected],
  );

  const loaded = !!uid && cartState?.uid === uid && favState?.uid === uid;

  const value = useMemo<ShopContextValue>(
    () => ({
      loaded,
      cart,
      cartCount: cart.reduce((sum, l) => sum + l.quantity, 0),
      favorites,
      addToBag,
      setQuantity,
      removeFromBag,
      toggleFavorite,
      isFavorite: (id: number) => favorites.includes(id),
    }),
    [loaded, cart, favorites, addToBag, setQuantity, removeFromBag, toggleFavorite],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
