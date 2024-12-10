"use client";

import { db } from "../_utils/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth } from "../_utils/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth"; // Import updateProfile
import Link from "next/link";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [quizHistory, setQuizHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchOrCreateUserProfile(currentUser);
        subscribeToQuizHistory(currentUser.uid);
        fetchAchievements();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchOrCreateUserProfile = async (currentUser) => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile(data);
        setDisplayName(data.displayName || "Anonymous");
      } else {
        const defaultProfile = {
          displayName: currentUser.displayName || "Anonymous",
          email: currentUser.email,
        };
        await setDoc(userDocRef, defaultProfile);
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Error fetching or creating user profile:", error);
    }
  };

  const subscribeToQuizHistory = (userId) => {
    try {
      const quizCollection = collection(db, "quizResults");
      const q = query(quizCollection, where("userId", "==", userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const history = querySnapshot.docs.map((doc) => doc.data());
        setQuizHistory(history);
      });

      return () => unsubscribe(); // Clean up listener when component unmounts
    } catch (error) {
      console.error("Error subscribing to quiz history:", error);
    }
  };

  const fetchAchievements = async () => {
    const badges = [
      { id: 1, name: "First Quiz Completed", icon: "🏆" },
      { id: 2, name: "10 Quizzes Completed", icon: "🎉" },
      { id: 3, name: "High Scorer", icon: "💯" },
    ];
    setAchievements(badges);
  };

  const handleSave = async () => {
    if (user) {
      try {
        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, { displayName });

        // Update Firebase Authentication profile
        await updateProfile(auth.currentUser, { displayName });

        // Update the local user object
        setUser({ ...user, displayName });

        alert("Profile updated successfully!");
        setEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-6">Profile</h1>
      {profile ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-lg font-bold mb-2">Name:</label>
            {editing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            ) : (
              <p>{profile.displayName || "Anonymous"}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-lg font-bold mb-2">Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="flex justify-end">
            {editing ? (
              <button
                onClick={handleSave}
                className="text-center bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition duration-200 shadow-sm"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-center bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition duration-200 shadow-sm"
              >
                Edit
              </button>
            )}
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
            {quizHistory.length > 0 ? (
              <ul className="list-disc pl-6">
                {quizHistory.map((quiz, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-bold">{quiz.category}</span> -{" "}
                    <span>{quiz.score} pts</span>{" "}
                    <span className="text-gray-500 text-sm">
                      ({new Date(quiz.timestamp?.toDate()).toLocaleString()})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No quiz history found.</p>
            )}
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center bg-gray-200 p-4 rounded-lg shadow-md"
                  >
                    <span className="text-2xl mr-4">{achievement.icon}</span>
                    <p>{achievement.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No achievements yet.</p>
            )}
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <Link
              href="/topics"
              className="text-center bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition duration-200 shadow-sm"
            >
              Back to Topics
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-center">No profile found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
