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

      // remove tokens and user info
      Cookies.remove("accessToken");
      Cookies.remove("user");

      // make api call to refresh token endpoint if refresh token exists
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        return api
          .post("/auth/refresh", { refreshToken })
          .then((res) => {
            const { accessToken: newAccessToken } = res.data.data;
            Cookies.set("accessToken", newAccessToken);
            // retry the original request with the new token
            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api.request(error.config);
          })
          .catch((refreshError) => {
            console.error("Refresh token failed:", refreshError);
            // if refresh also fails, redirect to login
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
