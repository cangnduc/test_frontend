"use client";
import { authClient } from "./lib/auth-client";
import React, { useState } from "react";
export function SignIn() {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("password123");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name: "Test User",
      },
      {
        onRequest: (ctx) => {
          console.log("Signing up user with email:", ctx);
        },
        onSuccess: (ctx) => {
          console.log("User signed up:", ctx);
        },
        onError: (ctx) => {
          // display the error message
          console.log("error:", ctx.error);
          alert(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
