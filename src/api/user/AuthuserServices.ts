import { AxiosError } from "axios";
import axiosInstance from "../axios";

interface IcreateUser {
  email: string;
  password: string;
}

interface ErrorResponse {
  error: string;
}

export const createUser = async (userData: IcreateUser) => {
  console.log(userData);

  try {
    const response = await axiosInstance.post("/user/auth/register", userData);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;

    if (axiosError.response) {
      const errorData = axiosError.response.data as ErrorResponse;

      if (errorData.error === "Email is already in use") {
        return errorData.error;
      } else {
        console.error("An unexpected error occurred:", errorData);
      }
    } else {
      console.error("An unexpected error occurred:", axiosError);
    }
  }
};

export const otpGenerate = async (email: string) => {
  try {
    const response = await axiosInstance.post("/user/auth/generate-otp", {
      email,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/user/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const resendOtp = async (email: string) => {
  try {
    console.log(email);

    const response = await axiosInstance.post("/user/auth/resendotp", {
      email,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/user/auth/userlogin", {
      email,
      password,
    });
    const { accessToken, refreshToken } = response.data;
    if (accessToken && refreshToken) {
      localStorage.setItem("userAccessToken", accessToken);
      localStorage.setItem("userRefreshToken", refreshToken);
    }
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const handleforgetpassword = async (email: string) => {
  try {
    const response = await axiosInstance.post("/user/auth/forgetpassword", {
      email,
    });
    if (response) {
      return response.data;
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const handleforgetpasswordOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post(
      "/user/auth/verifyforgetpassword",
      { email, otp }
    );
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      const errorData = axiosError.response.data as ErrorResponse;
      return errorData.error;
    }
  }
};

export const changePassword = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/user/auth/changepassword", {
      email,
      password,
    });
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};

export const google = async () => {
  try {
    const response = await axiosInstance.get("/auth/google");
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

export const logout = () => {
  localStorage.removeItem("userAccessToken");
  localStorage.removeItem("userRefreshToken");
};
