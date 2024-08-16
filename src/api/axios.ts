import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axiosInstance.post("/user/auth/refresh-token");
          return axiosInstance(originalRequest);
        } catch (err) {
          window.location.href = "/";
          localStorage.clear();
          return Promise.reject(err);
        }
      } else if (error.response.status === 403) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
