"use client";

import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <div className="flex-grow flex flex-col items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-5xl font-bold mb-6 text-purple-700">Features</h1>
          <p className="text-lg mb-6">
            Discover the amazing features of{" "}
            <span className="text-yellow-500">SmartQuizHub</span>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2 text-purple-700">
                Interactive Quizzes
              </h2>
              <p>Engage in a variety of quizzes tailored to your interests and knowledge.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2 text-purple-700">
                Global Leaderboards
              </h2>
              <p>Compete with players worldwide and climb to the top of the leaderboard.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2 text-purple-700">
                Reward System
              </h2>
              <p>Earn badges and rewards for completing challenges and acing quizzes.</p>
            </div>
          </div>
        </div>

        {/* Home Button */}
        <Link href="/" passHref>
          <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
