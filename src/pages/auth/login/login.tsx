import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  isValidateEmail,
  isValidatePassword,
} from "../../../utility/Validator";
import Loading from "../../../style/loading";
import { userLogin } from "../../../api/user/AuthuserServices";
import ForgetPassword from "../forgetpassword/forgetPassword";
import Store from "../../../store/store";
import useShowToast from "../../../Custom Hook/showToaster";
import GoogleAuth from "../googleAuth/googleAuth";


const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastSubmittedValues, setLastSubmittedValues] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const Toast=useShowToast()

  const { setUser } = Store();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const validateForm = () => {
    const errors: string[] = [];
    const validEmail = isValidateEmail(email);
    const validPassword = isValidatePassword(password);

    if (!email) {
      errors.push("Email is required.");
    } else if (!validEmail) {
      errors.push("Invalid email format or domain not allowed.");
    }

    if (!password) {
      errors.push("Password is required.");
    } else if (!validPassword) {
      errors.push(
        "Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character."
      );
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLastSubmittedValues({ email, password });

    if (
      email === lastSubmittedValues.email &&
      password === lastSubmittedValues.password
    ) {
      if (formSubmitted) {
        Toast("No changes detected. Please modify your input.",'info',true);
      } else {
        Toast("Please make changes to submit the form.",'info',true);
      }
      return;
    }

    setFormSubmitted(true);
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => Toast(error,'error',true));
      setFormSubmitted(false);
      return;
    }

    try {
      const response = await userLogin(email, password);
      if (response.message) {
        setUser(response.userObject);
        console.log(response.userObject)
        Toast(response.message,'success',true);
        setTimeout(() => navigate("/"), 1000);
      } else if (response.error) {
        Toast(response.error,'error',true);
      }
    } catch (error) {
      Toast("Login failed",'error',true);
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading && <Loading />}
      {!loading && (
        <>
          <form
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Login</h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
              <p
                onClick={toggleModal}
                className="text-blue-500 text-sm mt-3 cursor-pointer text-right"
              >
                Forgot <u>password?</u>
              </p>
              <p className="text-center mt-4">
                Don't have an account?{" "}
                <Link to={"/register"} className="text-blue-500">
                  Register
                </Link>
              </p>
              <p className="text-center mt-4">or</p>
              <div className="flex justify-center mt-4">
                    <GoogleAuth/>
              </div>
            </div>
          </form>

          {isModalOpen && <ForgetPassword toggleModal={toggleModal} />}
        </>
      )}
    </div>
  );
};

export default Login;
