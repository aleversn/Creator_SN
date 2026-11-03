import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/api",
  timeout: 15000
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("ApiToken");
  const expiresAt = Number(localStorage.getItem("ApiTokenExpiredAt") || 0);
  if (expiresAt && Date.now() / 1000 >= expiresAt) {
    localStorage.removeItem("ApiToken");
    localStorage.removeItem("ApiTokenExpiredAt");
  } else if (token) {
    config.headers["Api-key"] = token;
  }
  return config;
});

export default client;
