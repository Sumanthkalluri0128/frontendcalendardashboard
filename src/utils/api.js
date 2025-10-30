// client/src/api.js
const API_BASE_URL = "https://calendarcustomdashboard.onrender.com";

export const apiClient = axios.create({
baseURL: API_BASE_URL,
withCredentials: true,
});
if (!API_URL) {
  console.error("❌ REACT_APP_API_URL is not set. Please set it to your backend URL.");
  // redirect to server-down so user sees friendly message
  if (typeof window !== "undefined") window.location.href = "/server-down";
}

export const apiFetch = async (path, options = {}) => {
  const url = `${API_URL}${path}`;
  try {
    const res = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    // If backend unreachable, fetch will throw and we catch below
    if (!res.ok) {
      // 401 means client should re-login — bubble up
      const body = await res.json().catch(() => ({ error: res.statusText }));
      const err = new Error(body.error || `API error ${res.status}`);
      err.status = res.status;
      throw err;
    }

    return res.json();
  } catch (err) {
    console.error("API fetch failed:", err);
    if (typeof window !== "undefined") window.location.href = "/server-down";
    throw err;
  }
};
