import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  const signIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const logout = () => {
    setUser(null);
    setEvents([]);
    window.location.href = "/";
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/events", {
        credentials: "include",
      });
      const data = await res.json();

      setEvents(data.events || []);

      if (data.events?.length > 0) {
        const first = data.events[0];
        setUser({
          email: first.organizer?.email || "",
          name: first.organizer?.displayName || "User",
        });
      }
    } catch (e) {
      console.log("Event fetch error", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ events, fetchEvents, signIn, logout, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
