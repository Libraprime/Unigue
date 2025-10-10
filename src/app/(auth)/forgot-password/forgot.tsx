'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from "firebase/auth";
import { useFirebase } from '../../../components/FirebaseProvider'

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { auth, loading: firebaseLoading } = useFirebase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!auth) {
      setError("Auth service is not available.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Please check your inbox.");
    } catch (err: unknown) {
      console.error(err);
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        typeof (err as { code?: unknown }).code === 'string' &&
        ((err as { code: string }).code === 'auth/invalid-email' || (err as { code: string }).code === 'auth/user-not-found')
      ) {
        setError("Invalid email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (firebaseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className='h-screen font-serif text-black flex flex-col mx-5 md:mx-52 items-start'>
      <h1 className='font-bold text-3xl mt-5 md:mt-32 uppercase'>Forgot password</h1>
      <p className='pt-10'>We will send a new password reset link to your email</p>

      <form onSubmit={handleSubmit} className='w-full'>
        <p className='pt-10 pb-3'>Email</p>
        <label htmlFor='email' className='input validator bg-amber-50'>
          <svg className='h-[1em] opacity-50' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <g strokeLinejoin='round' strokeLinecap='round' strokeWidth='2.5' fill='none' stroke='currentColor'>
              <rect width='20' height='16' x='2' y='4' rx='2'></rect>
              <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
            </g>
          </svg>
          <input
            type='email'
            name='email'
            placeholder='account@email.com'
            id='email'
            className='bg-amber-50'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}

        <button className='btn btn-base w-48 my-5' type='submit' disabled={loading}>
          {loading ? 'Submitting...' : 'SUBMIT'}
        </button>
      </form>

      <Link href="/login" className="text-blue-500 mt-2">
        Back to login
      </Link>
    </div>
  );
}
