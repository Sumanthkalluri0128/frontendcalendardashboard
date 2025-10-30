// client/src/pages/ServerDown.jsx
import React from "react";

export default function ServerDown() {
  return (
    <div style={{ textAlign: "center", padding: 60, fontFamily: "Arial, sans-serif" }}>
      <h1>⚠️ Backend Unreachable</h1>
      <p>The backend service appears to be offline or misconfigured.</p>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => window.location.reload()} style={{ marginRight: 10 }}>
          Retry
        </button>
        <a href={process.env.REACT_APP_FRONTEND_URL || "/"}>Go to Home</a>
      </div>
      <p style={{ marginTop: 20, color: "#666" }}>
        If the problem persists, contact the site administrator.
      </p>
    </div>
  );
}
