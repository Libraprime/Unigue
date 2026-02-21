'use client';
import { useState, useEffect } from 'react';
import { useFirebase } from './FirebaseProvider';
import { collection, onSnapshot } from 'firebase/firestore';

export default function MobileMenu() {
    const{ currentUser, db } = useFirebase();
    const [cartCount, setCartCount] = useState(0);
    const dateJoined = currentUser?.metadata.creationTime 
        ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
            })
        : "Guest";

    useEffect(() => {
        if (!db || !currentUser) return;

        // Assuming your DB path is: users/{uid}/cart
        const cartRef = collection(db, "users", currentUser.uid, "cart");
        
        const unsubscribe = onSnapshot(cartRef, (snapshot) => {
            setCartCount(snapshot.size);
        });

        return () => unsubscribe();
    }, [db, currentUser]);

    const handleClose = () => {
        const elem = document.activeElement as HTMLElement;
        if (elem) {
            elem.blur();
        }
    };

    console.log("Current User ID:", currentUser?.uid, "Is Anonymous:", currentUser?.isAnonymous);

    return (
        <div className="p-3">
            <div className="flex items-center justify-between pb-5">
                <p className="font-medium">Menu</p>
                <div 
                    onClick={handleClose} 
                    className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 512 512">
                        <polygon
                        points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                    </svg>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <div className="avatar">
                    <div className="w-16 rounded-full">
                        <img src={currentUser?.photoURL || "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"} />
                    </div>
                </div>
                <div className="p-3">
                    <p className="text-lg font-bold">Hi, {currentUser?.displayName || "Guest"}</p>
                    <p className="text-sm">member since {dateJoined}</p>
                </div>
            </div>

            <div className="mb-10">
                <label htmlFor="search" className="input mb-5">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input id="search" type="search" required placeholder="Search" />
                </label>
                
                <div className="font-medium">
                    <p className="pb-4">My Cart({cartCount} Items)</p>
                    <p className="pb-4">Favourites</p>
                    <p className="pb-4">Men</p>
                    <p className="pb-4">Women</p>
                    <p className="pb-4">Kids</p>
                    <p className="pb-4">Brands</p>
                </div>
            </div>
        </div>
    )
}