import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { signIn, user } = useAuth();

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4 shadow">
      <h1 className="text-xl font-bold">📅 MERN Calendar</h1>
      <div>
        {user ? (
          <span>Welcome, {user.name || "User"}!</span>
        ) : (
          <button
            onClick={signIn}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
