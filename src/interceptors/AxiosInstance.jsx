import axios from "axios";

// import store from "../redux/store";
// import authService from "../services/authService";
// import { setCredentials,logout } from "../redux/auth/authSlice";
import config from "../constant/linkApi";
const axiosInstance = axios.create({
  baseURL: `${config.API_URL}/`,
  headers: {
    "Content-type": "application/json",
  },
  //withCredentials: true,
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    //
    if (config.url.includes("ngrok-free.app")) {
      config.headers["ngrok-skip-browser-warning"] = "69420";
    }
    //
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // try {
      //   const state = store.getState();
      //   const refreshToken = state.auth.refreshToken;
      //   if (!refreshToken) {
      //     store.dispatch(logout());
      //     return Promise.reject(error);
      //   }

      //   const data = await authService.refreshToken(refreshToken);
      //   store.dispatch(setCredentials({
      //     user: state.auth.user,
      //     accessToken: data.accessToken,
      //     refreshToken: data.refreshToken,
      //   }));

      //   originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      //   return axiosInstance(originalRequest);
      // } catch (refreshError) {
      //   store.dispatch(logout());
      //   return Promise.reject(refreshError);
      // }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
