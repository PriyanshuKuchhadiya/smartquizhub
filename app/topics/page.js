"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../_utils/firebase"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import auth methods
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function TopicsPage() {
  const [topics, setTopics] = useState([
    { id: "9", name: "General Knowledge", icon: "📚", description: "Trivia from all over the world.", popular: true },
    { id: "10", name: "Entertainment: Books", icon: "📖", description: "Questions about famous books.", popular: false },
    { id: "11", name: "Entertainment: Film", icon: "🎥", description: "Explore questions about movies.", popular: true },
    { id: "12", name: "Entertainment: Music", icon: "🎵", description: "Trivia on your favorite music.", popular: false },
    { id: "13", name: "Entertainment: Musicals & Theatres", icon: "🎭", description: "Dive into musicals and theatres.", popular: false },
    { id: "14", name: "Entertainment: Television", icon: "📺", description: "TV shows and series trivia.", popular: false },
    { id: "15", name: "Entertainment: Video Games", icon: "🎮", description: "Explore video game trivia.", popular: true },
    { id: "16", name: "Entertainment: Board Games", icon: "🎲", description: "Trivia about board games.", popular: false },
    { id: "17", name: "Science & Nature", icon: "🌱", description: "Discover science and nature trivia.", popular: true },
    { id: "18", name: "Science: Computers", icon: "💻", description: "Learn about computers and tech.", popular: true },
    { id: "19", name: "Science: Mathematics", icon: "➗", description: "Improve your math skills.", popular: false },
    { id: "20", name: "Mythology", icon: "⚡", description: "Explore myths and legends.", popular: true },
    { id: "21", name: "Sports", icon: "🏀", description: "Sports trivia for fans.", popular: true },
    { id: "22", name: "Geography", icon: "🌍", description: "Trivia about countries and places.", popular: false },
    { id: "23", name: "History", icon: "📜", description: "Discover historical events.", popular: true },
    { id: "24", name: "Politics", icon: "🏛️", description: "Dive into political trivia.", popular: false },
    { id: "25", name: "Art", icon: "🎨", description: "Learn about famous artworks.", popular: false },
    { id: "26", name: "Celebrities", icon: "🌟", description: "Trivia about popular figures.", popular: false },
    { id: "27", name: "Animals", icon: "🐾", description: "Learn fun facts about animals.", popular: false },
    { id: "28", name: "Vehicles", icon: "🚗", description: "Trivia about cars and vehicles.", popular: false },
    { id: "29", name: "Entertainment: Comics", icon: "🦸", description: "Dive into the world of comics.", popular: false },
    { id: "30", name: "Science: Gadgets", icon: "📱", description: "Trivia about modern gadgets.", popular: false },
    { id: "31", name: "Entertainment: Japanese Anime & Manga", icon: "🎌", description: "Trivia for anime and manga fans.", popular: true },
    { id: "32", name: "Entertainment: Cartoon & Animations", icon: "🎥", description: "Trivia about cartoons and animations.", popular: false },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("any");
  const [numQuestions, setNumQuestions] = useState(10);
  const [type, setType] = useState("any");
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Confirmation popup

  const router = useRouter(); // Initialize useRouter for redirection

  // Track authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogoutConfirm = async () => {
    try {
      await signOut(auth);
      setShowLogoutPopup(false); // Close confirmation popup
      router.push("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout.");
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
        <h1 className="text-xl font-bold">SmartQuizHub</h1>
      </nav>

      {/* Hamburger Menu Dropdown */}
      {menuOpen && (
        <div className="bg-gray-800 text-white w-64 p-4 absolute top-14 left-0 shadow-lg z-50">
          <p className="mb-4 text-lg font-bold">
            Hello, {user?.displayName || user?.email || "Guest"}
          </p>
          <ul>
            <li className="mb-4">
              <Link href="/" className="text-lg hover:underline">
                Home
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/profile" className="text-lg hover:underline">
                Profile
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/leaderboard" className="text-lg hover:underline">
                Leaderboard
              </Link>
            </li>
            <li className="mb-4">
              <button
                onClick={() => setShowLogoutPopup(true)} // Trigger confirmation popup
                className="text-lg hover:underline focus:outline-none"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Header */}
      <header className="text-center py-12">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Explore <span className="text-blue-500">Quiz Topics</span>
        </h1>
        <p className="text-lg max-w-3xl mx-auto mb-8">
          Customize your quiz by selecting topics, difficulty, type, and number of questions.
        </p>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 mb-10">
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div>
              <label className="block text-lg font-medium mb-2">Search Topics</label>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-lg font-medium mb-2">Number of Questions</label>
              <input
                type="number"
                min="1"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-lg font-medium mb-2">Select Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="any">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Type Selector */}
            <div>
              <label className="block text-lg font-medium mb-2">Select Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="any">Any Type</option>
                <option value="multiple">Multiple Choice</option>
                <option value="boolean">True / False</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{topic.name}</h3>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <Link
                    href={{
                      pathname: "/quizpage",
                      query: {
                        amount: numQuestions,
                        category: topic.id,
                        difficulty: difficulty !== "any" ? difficulty : undefined,
                        type: type !== "any" ? type : undefined,
                        categoryName: topic.name, // Pass the topic name
                      },
                    }}
                  >
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Start Quiz
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg font-medium">No topics found.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 mt-12 bg-gray-800 text-white text-center">
        <p>&copy; 2024 SmartQuizHub. All rights reserved.</p>
      </footer>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogoutConfirm}
                className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
