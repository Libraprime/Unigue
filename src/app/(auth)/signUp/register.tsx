'use client';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useFirebase } from '../../../components/FirebaseProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const router = useRouter();

  // Use the custom hook to access the Firebase services
  const { auth, loading: firebaseLoading } = useFirebase();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!auth) {
      console.error("Auth service is not available.");
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's profile with the provided name
      if (auth.currentUser && name) {
        await updateProfile(auth.currentUser, {
          displayName: name
        });
      }
      router.push('/');
      console.log('Registration successful!');
    } catch (err: any) {
      console.error(err);

      // Handle different Firebase authentication errors
      let errorMessage = 'An unexpected error occurred.';
      if (err.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
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
    <div className='h-screen font-serif text-black flex flex-col mx-5 md:mx-52 items-start'>
      <h1 className='text-center font-bold text-3xl mt-5 uppercase'>Register Account</h1>
      <p className='pt-10'>Let's create your account</p>

      <form onSubmit={handleRegister} className='w-full'>
        <p className='pt-10 pb-2'>Full Name</p>
        <label htmlFor='name' className='input validator bg-amber-50'>
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
            type='text'
            name='name'
            placeholder='Full Name'
            id='name'
            className='bg-amber-50'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <p className='pt-6 pb-2'>Email</p>
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

        <p className='pt-6 pb-2'>Password</p>
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
            className='bg-amber-50'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <p className='pt-6 pb-3'>Confirm Password</p>
        <label className='input validator bg-amber-50' htmlFor='confirm-password'>
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
            placeholder='Confirm Password'
            id='confirm-password'
            name='confirm-password'
            className='bg-amber-50'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

       <p className='py-2'>
        <input type="checkbox" name="" id="" />
        By creating your account, you agree with our <Link className='font-semibold' href='/Info/termsConditions'>Terms and Conditions</Link> & <Link className='font-semibold' href='/Info/privacy_policy'>Privacy Policy</Link>
       </p>
        
        {error && <p className='text-red-500'>{error}</p>}
        
        <button className='btn btn-base w-48' type='submit' disabled={loading}>
          {loading ? 'Registering...' : 'REGISTER'}
        </button>

        <p className='pt-5'>
          Already have an account? <Link href='/login' className='font-semibold'>Login</Link>
        </p>
      </form>
    </div>
  );
}
