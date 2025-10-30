import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Dynamic backend URL switch
  const API_URL = "https://frontendcalendardashboard.vercel.app";

  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ Google Login redirect dynamic
  const signIn = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const logout = () => {
    setUser(null);
    setEvents([]);
    window.location.href = "/";
  };

  // ✅ Fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/events`, {
        credentials: "include", // ✅ keep cookies/session
      });

      const data = await res.json();

      if (data.error) {
        console.log("Auth error:", data.error);
        return;
      }

      setEvents(data || []);

      // ✅ auto set user from calendar data
      if (data.length > 0) {
        setUser({
          email: data[0]?.organizer?.email,
          name: data[0]?.organizer?.displayName || "User",
        });
      }
    } catch (err) {
      console.log("Event fetch error", err);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
