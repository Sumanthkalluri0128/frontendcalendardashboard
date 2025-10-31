import React, { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton";
import EventsTable from "./components/EventsTable";
import { getEvents } from "./api";
const tokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    // remove token from url for cleanliness
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
  return token;
};
export default function App() {
  const [jwt, setJwt] = useState(
    () => localStorage.getItem("jwt") || tokenFromUrl()
  );
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (jwt) {
      localStorage.setItem("jwt", jwt);
      setLoading(true);
      getEvents(jwt)
        .then((res) => {
          setEvents(res.events || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch events");
          setLoading(false);
        });
    }
  }, [jwt]);
  return (
    <div className="container">
      <h1>Calendar Dashboard</h1>
      {!jwt ? (
        <div>
          <p>Please sign in with Google to view your calendar events.</p>
          <LoginButton onToken={(t) => setJwt(t)} />
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              localStorage.removeItem("jwt");
              setJwt(null);
              setEvents([]);
            }}
          >
            Sign out
          </button>
          {loading ? <p>Loading events...</p> : <EventsTable events={events} />}
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}
