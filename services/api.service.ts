import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.BASE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");

      Cookies.remove("accessToken");
      Cookies.remove("user");

      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        return api
          .post("/auth/refresh", null, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          })
          .then((res) => {
            const { accessToken: newAccessToken } = res.data.data;
            Cookies.set("accessToken", newAccessToken);
            
            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api.request(error.config);
          })
          .catch((refreshError) => {
            console.error("Refresh token failed:", refreshError);
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          });
      }

      // if no refresh token, redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
