"use client";
import { useUserAuth } from "./_utils/auth-context";
import Link from "next/link";

export default function Home() {
  const { user, firebaseSignOut } = useUserAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white relative">
      {/* Header Section */}
      <header className="flex justify-between items-center px-6 py-4">
        <h1 className="text-3xl font-bold">SmartQuizHub</h1>
        <nav className="flex space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/features" className="hover:underline">
            Features
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-6xl font-extrabold drop-shadow-lg mb-4">
          Welcome to <span className="text-yellow-300">SmartQuizHub</span>
        </h1>
        <p className="text-lg mb-6">
          Test your knowledge and compete with the world! Earn rewards, climb
          leaderboards, and enjoy endless fun.
        </p>

        {/* Call to Action */}
        {user ? (
          <div className="text-center">
            <p className="text-xl mb-6">
              Welcome back,{" "}
              <span className="font-bold text-yellow-300">
                {user.displayName || "User"}
              </span>
              !
            </p>
            <div className="flex flex-col gap-4 justify-center items-center">
              <Link
                href="/topics"
                className="px-6 py-3 bg-yellow-300 text-purple-800 font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition"
              >
                Explore Topics
              </Link>
              <button
                onClick={firebaseSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md hover:shadow-lg transform hover:scale-105 transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              href="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 shadow-md hover:shadow-lg transform hover:scale-105 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-12 px-4 rounded-t-lg">
        <h2 className="text-4xl font-bold text-center mb-6">
          Why Choose SmartQuizHub?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Interactive Quizzes</h3>
            <p className="text-sm">
              Engage in thousands of quizzes tailored to your interests.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Global Leaderboards</h3>
            <p className="text-sm">
              Compete with friends and players worldwide to earn top rankings.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Reward System</h3>
            <p className="text-sm">
              Earn badges and rewards as you complete challenges and quizzes.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <h2 className="text-4xl font-bold text-center mb-6">What Users Say</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md max-w-sm">
            <p className="italic">
              &quot;SmartQuizHub is an amazing platform! I&apos;ve learned so much while
              having fun.&quot;
            </p>
            <p className="mt-4 font-bold">- Alex Johnson</p>
          </div>
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md max-w-sm">
            <p className="italic">
              &quot;The quizzes are challenging yet enjoyable. Highly recommended!&quot;
            </p>
            <p className="mt-4 font-bold">- Maria Gonzalez</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2024 SmartQuizHub. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a
            href="#"
            className="text-blue-500 hover:underline"
            aria-label="Facebook"
          >
            Facebook
          </a>
          <a
            href="#"
            className="text-blue-400 hover:underline"
            aria-label="Twitter"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-red-500 hover:underline"
            aria-label="Instagram"
          >
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
