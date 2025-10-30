// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/auth/events", { method: "GET" });
      setEvents(data.events || []);
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
        setEvents([]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // restore session
    const init = async () => {
      try {
        const data = await apiFetch("/api/auth/me", { method: "GET" });
        setUser(data);
        await fetchEvents();
      } catch (err) {
        // if backend returned 401 or redirect happened, user stays null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchEvents]);

  const signIn = () => {
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      setEvents([]);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ events, fetchEvents, signIn, logout, user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
