import axios from "axios";

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
