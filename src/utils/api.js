import axios from "axios";

// This is the constant you provided, which is correct.
export const API_BASE_URL = "https://calendarcustomdashboard.onrender.com/api";

// --- CRITICAL FIX: CREATE A CONFIGURED AXIOS CLIENT ---
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This tells axios to send the session cookie
});

// --- Use this new 'apiClient' for all your frontend requests ---

/**
 * Fetches calendar events from the backend.
 * This request will now include the cookie, and req.session.userId will work.
 */
export const fetchCalendarEvents = () => {
  return apiClient.get("/auth/getCalendarEvents"); // Your route is /api/auth/getCalendarEvents
};
// --- Function 2: Get the Logged-in User ---
// This hits a new backend route we will create
export const fetchCurrentUser = () => {
  return apiClient.get("/auth/me");
};
