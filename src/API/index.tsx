import axios from "axios";

/**
 * Function to get current language from localStorage or default to 'ru'
 * This is used by the API interceptor to automatically add locale parameters
 * to all API requests based on the user's selected language.
 */
const getCurrentLanguage = (): string => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.state?.language || "ru";
      } catch {
        return "ru";
      }
    }
  }
  return "ru";
};

/**
 * API instance with automatic locale parameter injection.
 * All requests will automatically include locale=uz or locale=ru parameter
 * based on the user's language selection stored in the theme store.
 */
const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://exuberant-comfort-0c2f94bc2b.strapiapp.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

API.interceptors.request.use(
  (config) => {
    if (!config.timeout || config.timeout < 20000) {
      config.timeout = 20000;
    }

    // Add locale parameter to all requests
    const currentLanguage = getCurrentLanguage();
    if (config.params) {
      config.params.locale = currentLanguage;
    } else {
      config.params = { locale: currentLanguage };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const code = error.code;
    const message = error.message;
    return Promise.reject(error);
  }
);

export default API;
