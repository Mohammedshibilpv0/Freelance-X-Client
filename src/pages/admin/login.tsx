import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { isValidateEmail, isValidatePassword } from '../../utility/Validator';
import { adminLogin } from '../../api/admin/adminServices';
import useShowToast from '../../Custom Hook/showToaster';
import useAdminStore from '../../store/adminStore';

const AdminLogin: React.FC = () => {
  const adminEmail = useAdminStore((state) => state.setAdminEmail);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const Toaster=useShowToast()
  const navigate = useNavigate();

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
      errors.push('Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character.');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => Toaster(error,'error',true));
      setLoading(false);
      return;
    }

    try {
      const response=await adminLogin(email,password)
        if(response.error){
            Toaster(response.error.error,'error',true)
        }
        if(response.message){
          adminEmail(email)
          Toaster(response.message,'success',true)
          navigate('/admin')
        }
      
    } catch (error) {
      Toaster('Login failed','error',true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading && <div className="loading">Loading...</div>}
      {!loading && (
        <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
          <div>
            <h3 className="text-2xl font-bold mb-6"> Admin Login</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Email address</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminLogin;
