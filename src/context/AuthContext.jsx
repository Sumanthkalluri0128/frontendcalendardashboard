import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../api";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
const [events, setEvents] = useState([]);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


const fetchEvents = useCallback(async () => {
setError(null);
try {
const res = await fetch(`${API_BASE_URL}/auth/events`, {
credentials: "include",
});


if (res.status === 401) {
setEvents([]);
setUser(null);
return;
}


const data = await res.json();
setEvents(data.events || []);
} catch (err) {
setError("Failed to fetch events");
setEvents([]);
}
}, []);


// Restore session
useEffect(() => {
(async () => {
try {
const res = await fetch(`${API_BASE_URL}/auth/me`, {
credentials: "include",
});
if (res.ok) {
const data = await res.json();
setUser(data);
await fetchEvents();
}
} catch (_) {}
setLoading(false);
})();
}, [fetchEvents]);


const signIn = () => {
window.location.href = `${API_BASE_URL}/auth/google`;
};


const logout = async () => {
await fetch(`${API_BASE_URL}/auth/logout`, {
method: "POST",
credentials: "include",
});
setUser(null);
setEvents([]);
window.location.href = "/";
};


return (
<AuthContext.Provider value={{ events, fetchEvents, signIn, logout, user, loading, error }}>
{children}
</AuthContext.Provider>
);
};


export const useAuth = () => useContext(AuthContext);
