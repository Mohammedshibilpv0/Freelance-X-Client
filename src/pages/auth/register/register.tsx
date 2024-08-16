import { Link } from 'react-router-dom';
import './register.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleButton from 'react-google-button';
import { useState } from 'react';
import { createUser, otpGenerate,google } from '../../../api/user/AuthuserServices';
import { isValidateEmail, isValidatePassword } from '../../../utility/Validator';
import toastr from 'toastr';
import Loading from '../../../style/loading';
import Otp from '../../../components/auth/otp/otp';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [lastSubmittedValues, setLastSubmittedValues] = useState<{ email: string, password: string, confirmPassword: string }>({ email: '', password: '', confirmPassword: '' });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    const errors: string[] = [];
    const validEmail = isValidateEmail(email);
    const validPassword = isValidatePassword(password);

    if (!email) {
      errors.push('Email is required.');
    } else if (!validEmail) {
      errors.push('Invalid email format or domain not allowed.');
    }

    if (!password) {
      errors.push('Password is required.');
    } else if (!validPassword) {
      errors.push('Password must be at least 6 characters long and contain one uppercase letter, one number, and one special character.');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match.');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === lastSubmittedValues.email && password === lastSubmittedValues.password && confirmPassword === lastSubmittedValues.confirmPassword) {
      if (formSubmitted) {
        toastr.info('No changes detected. Please modify your input.');
      } else {
        toastr.info('Please make changes to submit the form.');
      }
      return;
    }

    setFormSubmitted(true);
    const errors = validateForm();

    if (errors.length > 0) {
      errors.forEach(error => toastr.error(error));
      setFormSubmitted(false);
      return; 
    }

    try {
      setLoading(true);
      const response = await createUser({ email, password });

      if (response === 'Email is already in use') {
        toastr.error(response);
        setLoading(false);
        return; 
      } 

    
      setLastSubmittedValues({ email, password, confirmPassword });

      let res = await otpGenerate(email);
      setLoading(false);

      if (res.message === 'OTP sent successfully') {
        toastr.success('OTP sent successfully');
        setOtpSent(true);
      } else {
        toastr.error('Failed to send OTP');
      }
    } catch (error) {
      toastr.error('Registration failed');
      console.error('Registration failed:', error);
      setLoading(false);
    }
  };

  const handleGoogle =async()=>{
    window.open('http://localhost:3000/auth/google')
    
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
  {loading && <Loading />}
  {!otpSent && !loading ? (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-2xl font-bold mb-6 text-center">Register</h3>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email address
          </label>
          <input
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Submit
            </button>
        </div>
        <p className="text-center mt-4">
          Already have an account? <Link to='/login' className="text-blue-500 hover:text-blue-800">Login</Link>
        </p>
        <p className="text-center mt-2">or</p>
        <div className="flex justify-center mt-4">
          <GoogleButton onClick={handleGoogle} label='Continue with Google' />
        </div>
      </div>
    </form>
  ) : (
    otpSent && <Otp email={email} submitType='register'/>
  )}
</div>

  );
};

export default Register;
