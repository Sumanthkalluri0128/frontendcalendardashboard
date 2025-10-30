// frontend/src/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
      const res = await fetch(`${API_URL}/api/auth/events`, {
        credentials: "include",
      });

      if (res.status === 401) {
        setEvents([]);
        setUser(null);
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch events");
      }

      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Event fetch error", err);
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // try to restore session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          await fetchEvents();
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Init auth error", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchEvents]);

  const signIn = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
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
    <AuthContext.Provider
      value={{ events, fetchEvents, signIn, logout, user, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
