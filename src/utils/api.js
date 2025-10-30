// frontend/src/api.js
import axios from "axios";

// base backend URL (no trailing slash)
export const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL.replace(/\/$/, "")}/api`
  : "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const fetchCalendarEvents = () => apiClient.get("/auth/events");
export const fetchCurrentUser = () => apiClient.get("/auth/me");
