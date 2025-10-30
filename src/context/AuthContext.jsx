import React, { createContext, useContext, useState, useEffect } from "react";
import User from "../models/User.js"; // Import your User model

// --- THIS IS THE CRITICAL FIX ---
// The API_URL must be your BACKEND URL (Render), not your frontend (Vercel).
const API_URL = "https://calendarcustomdashboard.onrender.com";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start true for initial user fetch
  const [error, setError] = useState(null);

  // On initial app load, try to fetch the currently logged-in user
  // This checks if a session cookie already exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include", // Send the session cookie
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- UPDATED: Points to the backend API route ---
  const signIn = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const logout = () => {
    setUser(null);
    setEvents([]);
    window.location.href = "/"; // Redirect to homepage
  };

  // --- UPDATED: More robust error handling ---
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/events`, {
        credentials: "include", // ✅ This is correct
      });

      if (!res.ok) {
        // If response is not 200 (e.g., 401 Unauthorized), throw an error
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch events");
      }

      const data = await res.json();
      setEvents(data.events || []); // The backend sends { events: [...] }
    } catch (err) {
      console.error("Event fetch error", err);
      setError(err.message);
      setEvents([]); // Clear events on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        events,
        fetchEvents,
        signIn,
        logout,
        user,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
