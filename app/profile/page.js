"use client";

import { db, storage } from "../_utils/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { auth } from "../_utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const defaultProfileImage =
    "https://via.placeholder.com/150?text=Default+Profile";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchOrCreateUserProfile(currentUser);
        fetchQuizHistory(currentUser.uid);
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
        setProfilePicture(data.profilePicture || defaultProfileImage);
      } else {
        // Create a default profile document if it doesn't exist
        const defaultProfile = {
          displayName: currentUser.displayName || "Anonymous",
          email: currentUser.email,
          profilePicture: defaultProfileImage,
        };
        await setDoc(userDocRef, defaultProfile);
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Error fetching or creating user profile:", error);
    }
  };

  const fetchQuizHistory = async (userId) => {
    try {
      const quizCollection = collection(db, "quizResults");
      const q = query(quizCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map((doc) => doc.data());
      setQuizHistory(history);
    } catch (error) {
      console.error("Error fetching quiz history:", error);
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

  const handleProfilePictureUpload = async (file) => {
    if (user && file) {
      try {
        if (file.size > 10 * 1024 * 1024) {
          alert("File size exceeds the 10 MB limit.");
          return;
        }

        setUploading(true);
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, { profilePicture: downloadURL });

        setProfilePicture(downloadURL);
        alert("Profile picture updated!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (user) {
      try {
        const userDoc = doc(db, "users", user.uid);
        await updateDoc(userDoc, { displayName });
        alert("Profile updated successfully!");
        setEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-6">Profile</h1>
      {profile ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6 text-center">
            <img
              src={profilePicture || defaultProfileImage}
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
              className="block mx-auto text-sm"
              disabled={uploading}
            />
            {uploading && <p className="text-blue-500">Uploading...</p>}
          </div>
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
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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
                    <span className="font-bold">{quiz.topicName}</span> -{" "}
                    <span>{quiz.score} pts</span>
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
          <Link
            href="/"
            className="block mt-6 text-center text-blue-500 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <p className="text-center">No profile found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
