"use client";

import { db } from "../_utils/firebase"; // Import Firestore
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import Link from "next/link"; // For navigation
import { auth } from "../_utils/firebase"; // Import Firebase Auth
import { onAuthStateChanged } from "firebase/auth"; // For user authentication

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(undefined); // Initially undefined to indicate loading
  const [filter, setFilter] = useState("all"); // Filter for "all time" or "weekly"

  // Track authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Current user:", currentUser);
      setUser(currentUser || null);
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    if (user === undefined) {
      // User state is still initializing
      return;
    }

    if (!user) {
      console.error("User is not authenticated. Data fetch might fail.");
      setError("You need to be logged in to view the leaderboard.");
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "leaderboard"),
        orderBy("score", "desc"), // Order by highest score
        limit(10) // Limit to top 10 entries
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLeaderboard(data);
          setLoading(false);
        },
        (err) => {
          setError("Failed to fetch leaderboard data.");
          setLoading(false);
        }
      );

      return () => unsubscribe(); // Clean up subscription
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }, [user]);

  const handleShare = async () => {
    const shareText = `Check out my score on the SmartQuizHub Leaderboard!`;

    if (navigator.share) {
      // Use the Web Share API if supported
      try {
        await navigator.share({
          title: "SmartQuizHub Leaderboard",
          text: shareText,
          url: window.location.href,
        });
        alert("Leaderboard link shared successfully!");
      } catch (error) {
        alert("Failed to share the leaderboard link.");
      }
    } else if (navigator.clipboard) {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
        alert("Leaderboard link copied to clipboard!");
      } catch (error) {
        alert("Failed to copy leaderboard link to clipboard.");
      }
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  if (loading || user === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-gray-800">Loading leaderboard...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>{error}</p>
        <Link href="/" className="mt-4 text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Leaderboard</h1>
        <div className="flex space-x-4">
          
          <Link
            href="/topics"
            className="text-center bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition duration-200 shadow-sm"
          >
            Back to Topics
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-blue-500`}
        >
          All Time
        </button>
        <button
          onClick={() => setFilter("weekly")}
          className={`px-4 py-2 rounded ${
            filter === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-blue-500`}
        >
          This Week
        </button>
      </div>

      {/* Leaderboard */}
      <div className="max-w-2xl mx-auto bg-gray-100 text-gray-800 p-6 rounded-lg shadow-lg">
        {leaderboard.length > 0 ? (
          leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex justify-between py-2 border-b ${
                index === 0
                  ? "bg-yellow-300 font-bold text-yellow-900"
                  : index === 1
                  ? "bg-gray-200 text-gray-900"
                  : index === 2
                  ? "bg-yellow-100 text-yellow-800"
                  : ""
              }`}
            >
              <span>
                {index + 1}. {entry.username || "Anonymous"}
              </span>
              <span className="font-bold">{entry.score} pts</span>
            </div>
          ))
        ) : (
          <p className="text-center">No leaderboard entries yet.</p>
        )}
      </div>

      {/* Share Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleShare}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Share Your Rank
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPage;
