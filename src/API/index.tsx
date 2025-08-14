import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://exuberant-comfort-0c2f94bc2b.strapiapp.com",
  headers: {
    "Content-Type": "application/json",
  },
  // Increase timeout; Strapi on free tier can be slow
  timeout: 20000,
});

// Debug: Log the API base URL
console.log(
  "API Base URL:",
  process.env.NEXT_PUBLIC_API_URL ||
    "https://exuberant-comfort-0c2f94bc2b.strapiapp.com"
);

API.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("Full API URL:", (config.baseURL || "") + (config.url || ""));
    // Ensure we have a reasonable timeout on every request
    if (!config.timeout || config.timeout < 20000) {
      config.timeout = 20000;
    }
    return config;
  },
  (error) => {
    // Use console.warn instead of console.error to avoid Next.js error handling
    console.warn("API Request Error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const code = error.code;
    const message = error.message;
    // Use console.warn instead of console.error to avoid Next.js error handling
    console.warn("API Response Error:", status, data);
    if (code === "ECONNABORTED") {
      console.warn("Axios timeout/aborted request:", message);
    }
    return Promise.reject(error);
  }
);

export default API;
