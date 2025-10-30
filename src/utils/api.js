import axios from "axios";

// This is your DEPLOYED backend URL
export const API_BASE_URL = "https://calendarcustomdashboard.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This sends the cookie
});

// --- Function 1: Get Events ---
export const fetchCalendarEvents = () => {
  return apiClient.get("/auth/getCalendarEvents");
};

// --- Function 2: Get the Logged-in User ---
// This hits a new backend route we will create
export const fetchCurrentUser = () => {
  return apiClient.get("/auth/me");
};
