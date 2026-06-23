import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let sessionPromise = null;
let lastSessionFetch = 0;

apiClient.interceptors.request.use(
  async (config) => {
    // Cache the session promise for 2 seconds to prevent massive spam of /api/auth/session
    // when multiple API calls are fired simultaneously on page load.
    if (!sessionPromise || Date.now() - lastSessionFetch > 2000) {
      sessionPromise = getSession();
      lastSessionFetch = Date.now();
    }
    
    const session = await sessionPromise;
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Handle unauthorized error (e.g., redirect to login)
      // For now, just logging it
      console.error("Unauthorized access - redirecting to login may be needed");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
