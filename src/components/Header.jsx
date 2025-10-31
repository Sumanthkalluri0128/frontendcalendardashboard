import { useAuth } from "./context/AuthContext";

export default function Header() {
  const { user, signIn, logout } = useAuth();

  return (
    <header
      style={{
        background: "#4f46e5",
        color: "white",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>📅 Calendar Dashboard</h2>

      {user ? (
        <button
          onClick={logout}
          style={{
            padding: "8px 12px",
            background: "white",
            color: "#4f46e5",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={signIn}
          style={{
            padding: "8px 12px",
            background: "white",
            color: "#4f46e5",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </button>
      )}
    </header>
  );
}
