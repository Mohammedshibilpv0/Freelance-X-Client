import axios from "axios";

const axiosInstance = axios.create({
  withCredentials:true,
  baseURL: `http://localhost:3000`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userAccessToken = localStorage.getItem("AdminAccessToken");
    if (userAccessToken) {
      config.headers.Authorization = `Bear ${userAccessToken}`;
    }
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
    if (!originalRequest._retry && error.response.status === 401) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("AdminRefreshToken");
        const response = await axiosInstance.post("/user/auth/refresh-token", {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("AdminAccessToken", accessToken);
        localStorage.setItem("AdminRefreshToken", newRefreshToken);

        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
      } catch (err) {
        localStorage.removeItem("AdminAccessToken");
        localStorage.removeItem("AdminRefreshToken");
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
