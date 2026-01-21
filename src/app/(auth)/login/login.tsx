'use client';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebase } from '../../../components/FirebaseProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Oauth from '@/components/Oauth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();

  // Use the custom hook to access the Firebase services
  const { auth, loading: firebaseLoading } = useFirebase();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!auth) {
      console.error("Auth service is not available.");
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
      return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Signed in as:", user.displayName);
      route.push('/dashboard');
      console.log('Login successful!');
    } catch (err: unknown) {
      // Log the full error object for debugging purposes
      console.error(err);

      // Handle different Firebase authentication errors
      let errorMessage = 'An unexpected error occurred.';
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        typeof (err as { code?: unknown }).code === 'string' &&
        (
          (err as { code: string }).code === 'auth/invalid-email' ||
          (err as { code: string }).code === 'auth/user-not-found' ||
          (err as { code: string }).code === 'auth/wrong-password' ||
          (err as { code: string }).code === 'auth/invalid-credential'
        )
      ) {
        errorMessage = 'Invalid email or password.';
      }

      setError(errorMessage);
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
    <div className='h-screen font-serif text-black flex flex-col mx-5 md:ml-52 items-start'>
      <h1 className='font-bold text-3xl mt-5 md:mt-32 uppercase'>Welcome to unique stores</h1>
      <p className='pt-10'>Log into your account</p>

      <form onSubmit={handleLogin} className='w-full'>
        <p className='pt-10 pb-3'>Email</p>
        <label htmlFor='email' className='input validator bg-amber-50'>
          <svg className='h-[1em] opacity-50' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <g
              strokeLinejoin='round'
              strokeLinecap='round'
              strokeWidth='2.5'
              fill='none'
              stroke='currentColor'
            >
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

        <p className='pt-8 pb-3'>Password</p>
        <label className='input validator bg-amber-50' htmlFor='password'>
          <svg className='h-[1em] opacity-50' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <g
              strokeLinejoin='round'
              strokeLinecap='round'
              strokeWidth='2.5'
              fill='none'
              stroke='currentColor'
            >
              <path d='M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'></path>
              <circle cx='16.5' cy='7.5' r='.5' fill='currentColor'></circle>
            </g>
          </svg>
          <input
            type='password'
            required
            placeholder='Password'
            id='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div className='py-5 ml-48'>
          <Link href='/forgot-password'>
            Forgot password?
          </Link>
        </div>
        
        {error && <p className='text-red-500'>{error}</p>}
        
        <div className='flex gap-36'>
          <button className='btn btn-base' type='submit' disabled={loading}>
            {loading ? 'Logging In...' : 'LOGIN'}
          </button>

          
            <Oauth />
        </div>
  
        <p className='py-5'>
          Don&apos;t have an account? <Link href='/signUp' className='font-semibold'>Register</Link>
        </p>
      </form>
    </div>
  );
}
