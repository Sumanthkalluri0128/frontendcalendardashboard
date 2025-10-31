import React from "react";
import { getAuthUrl } from "../api";
export default function LoginButton({ onToken }) {
  const start = async () => {
    try {
      const urlResp = await getAuthUrl();
      // Open Google consent screen in same tab
      window.location.href = urlResp;
    } catch (err) {
      console.error("Login start error", err);
      alert("Failed to start login");
    }
  };
  return <button onClick={start}>Sign in with Google</button>;
}
