"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
      <p className="text-lg text-center max-w-2xl">
        Welcome to <span className="text-yellow-500">SmartQuizHub</span>, the ultimate platform for fun and educational quizzes! 
        Our mission is to make learning engaging, accessible, and enjoyable for everyone. Whether you're a trivia enthusiast or a casual learner, we have something for you.
      </p>
      <p className="mt-4 text-lg text-center max-w-2xl">
        Compete with friends, climb leaderboards, and earn rewards as you test your knowledge across various topics. 
        Join our vibrant community and explore the world of knowledge in an exciting way!
      </p>

      {/* Home Button */}
      <Link href="/" passHref>
        <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
