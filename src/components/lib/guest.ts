// Guest (anonymous) data helpers: read it before the session changes, then
// merge it into the real account. See docs/adr/0005-login-merges-guest-data.md

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";

export const MAX_QTY = 10;

export interface CartLine {
  productId: number;
  quantity: number;
}

export interface GuestData {
  cart: CartLine[];
  favorites: number[];
}

export async function readGuestData(db: Firestore, uid: string): Promise<GuestData> {
  const [cartSnap, favSnap] = await Promise.all([
    getDocs(collection(db, "users", uid, "cart")),
    getDocs(collection(db, "users", uid, "favorites")),
  ]);
  return {
    cart: cartSnap.docs.map((d) => ({
      productId: Number(d.data().productId ?? d.id),
      quantity: Number(d.data().quantity ?? 1),
    })),
    favorites: favSnap.docs.map((d) => Number(d.data().productId ?? d.id)),
  };
}

/**
 * Copies guest data into the signed-in account. Quantities add up (capped at
 * MAX_QTY); favourites are a set union. Never deletes anything from the
 * destination account.
 */
export async function mergeGuestData(db: Firestore, uid: string, guest: GuestData): Promise<void> {
  await Promise.all([
    ...guest.cart.map(async (line) => {
      const ref = doc(db, "users", uid, "cart", String(line.productId));
      const existing = await getDoc(ref);
      const current = existing.exists() ? Number(existing.data().quantity ?? 0) : 0;
      await setDoc(ref, {
        productId: line.productId,
        quantity: Math.min(current + line.quantity, MAX_QTY),
        updatedAt: serverTimestamp(),
      });
    }),
    ...guest.favorites.map((productId) =>
      setDoc(doc(db, "users", uid, "favorites", String(productId)), {
        productId,
        addedAt: serverTimestamp(),
      }),
    ),
  ]);
}
