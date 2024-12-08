"use client";

import { useUserAuth } from "../_utils/auth-context";
import { useState } from "react";
import { auth } from "../_utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function LoginPage() {
  const { googleSignIn, gitHubSignIn } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize useRouter

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      router.push("/"); // Redirect to the homepage after successful login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      router.push("/"); // Redirect to the homepage after successful login
    } catch (err) {
      setError("Failed to login with Google. Please try again.");
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await gitHubSignIn();
      router.push("/"); // Redirect to the homepage after successful login
    } catch (err) {
      setError("Failed to login with GitHub. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <Link href="/reset-password" className="text-sm text-purple-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white rounded-lg font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition"
          >
            LOGIN
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-gray-600 mb-4">Or login with</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleGitHubLogin}
              className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition"
            >
              GitHub
            </button>
            <button
              onClick={handleGoogleLogin}
              className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition"
            >
              Google
            </button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
