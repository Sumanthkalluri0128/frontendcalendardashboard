// client/src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, events, fetchEvents, loading, signIn, logout, error } = useAuth();

  useEffect(() => {
    if (user) fetchEvents();
  }, [user, fetchEvents]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!user)
    return (
      <div style={{ padding: 20 }}>
        <h2>Please sign in with Google</h2>
        <button onClick={signIn}>Sign in with Google</button>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>Welcome, {user.name || user.email}</h1>
        </div>
        <div>
          <button onClick={fetchEvents} style={{ marginRight: 8 }}>
            Refresh
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <section style={{ marginTop: 20 }}>
        <h2>Your upcoming events</h2>
        {events.length === 0 ? (
          <p>No upcoming events found.</p>
        ) : (
          <ul>
            {events.map((ev) => (
              <li key={ev.id} style={{ marginBottom: 12 }}>
                <strong>{ev.summary || "(No title)"}</strong>
                <div>
                  {ev.start?.dateTime || ev.start?.date} — {ev.end?.dateTime || ev.end?.date}
                </div>
                <div>Organizer: {ev.organizer?.email || "—"}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
