import React from "react";
import Link from "next/link";

export default function login() {
  return (
    <div className="grid-cols-2 h-screen">
      <h1>Welcome to unigue stores</h1>
      <p>Log into your account</p>

      <label htmlFor="Email">
        <input 
          type="email" 
          name="email"
          placeholder="account@email.com" 
          id="email" 
        />
      </label>

      <label htmlFor="Password">
        <input 
          type="password" 
          name="password" 
          id="password" 
        />
      </label>

      <Link href='/forgot-password'>Forgot password?</Link>

      <button>LOGIN</button>

      <p>Don't have an account? <Link href='/signUp'>Register</Link></p>
    </div>
  );
}