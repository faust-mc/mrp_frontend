// api.js
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";


const apiURL = "http://127.0.0.1:8001";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || apiURL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `CTGI7a00fn ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiURL}/mrp_api/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem(ACCESS_TOKEN, data.access);
          originalRequest.headers.Authorization = `CTGI7a00fn ${data.access}`;
          return api(originalRequest); 
        } catch (refreshError) {
          localStorage.clear(); 
          window.location.href = "/login"; 
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
