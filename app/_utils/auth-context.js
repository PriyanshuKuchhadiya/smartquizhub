"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  GoogleAuthProvider,
  updateProfile, // Import updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const gitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error("GitHub Login Error:", error.message);
      throw error;
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error("Google Login Error:", error.message);
      throw error;
    }
  };

  const firebaseSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign-out Error:", error.message);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, updates);
        setUser({ ...auth.currentUser, ...updates }); // Update the context with new user data
      } catch (error) {
        console.error("Error updating profile:", error.message);
        throw error;
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        gitHubSignIn,
        googleSignIn,
        firebaseSignOut,
        updateUserProfile, // Expose updateUserProfile method
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(AuthContext);
