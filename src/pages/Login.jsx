import React from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { signIn } = useAuth();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to MERN Calendar</h1>
      <button
        onClick={signIn}
        className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
