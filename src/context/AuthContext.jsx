import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // read token from localStorage
  const token = localStorage.getItem("token");

  // On mount: if token exists decode basic info from payload to show user email
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      // remove token from url
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      // set token variable by reloading the page state (or you can set user directly)
      // we'll decode token below
    }

    if (!token && !urlToken) {
      setLoading(false);
      return;
    }

    const stored = urlToken || token;
    try {
      const payload = JSON.parse(atob(stored.split(".")[1]));
      setUser({ email: payload.email });
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      setEvents([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        headers: { Authorization: `Bearer ${stored}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
        setEvents([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("fetchEvents error", err);
      setError("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/url`);
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start login");
      }
    } catch (err) {
      console.error("signIn error", err);
      alert("Failed to start login");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setEvents([]);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ events, fetchEvents, signIn, logout, user, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
