import React from "react";
import Link from "next/link";

export default function login() {
  return (
    <div className="h-screen text-black flex flex-col mx-5 md:mx-52 items-start">
      <h1 className="text-center font-bold text-3xl mt-5 md:mt-32 uppercase">Welcome to unique stores</h1>
      <p className="pt-10">Log into your account</p>


      <p className="pt-10 pb-3">Email</p>
      <label htmlFor="Email" className="input validator bg-amber-50">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        
        <input 
          type="email" 
          name="email"
          placeholder="account@email.com" 
          id="email" 
          className="bg-amber-50"
        />
      </label>


      <p className="pt-8 pb-3">Password</p>
      <label className="input validator bg-amber-50" htmlFor="Password">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
            ></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        
        <input 
          type="password"
          required
          placeholder="Password"
          id="password"
          name="password"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" 
        />
      </label>

      <Link href='/forgot-password' className="py-5 ml-48">Forgot password?</Link>

      <button className="btn w-48">LOGIN</button>

      <p className="py-5">Don't have an account? <Link href='/signUp' className="font-semibold">Register</Link></p>
    </div>
  );
}