// 'use client'

import React from 'react'
import Image from 'next/image'
// import { usePathname } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '../../../lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import Router from 'next/router'
import { useRouter } from 'next/navigation'

export default function Oauth() {
//   const pathname = usePathname()
  const router = useRouter()

  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Save user to Firestore if not already there
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        })
      }

      console.log("Signed in as:", user.displayName)
      router.push('/dashboard')

    } catch (error) {
      console.error("Google Sign-in error:", error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* <p>Sign {pathname === '/login' ? 'in' : 'up'}</p> */}
      <button
        type="button"
        onClick={onGoogleClick}
        className="p-2 border rounded"
      >
        <Image 
          src="/google.png"
          alt="google"
          height={20}
          width={20}
        />
      </button>
    </div>
  )
}
