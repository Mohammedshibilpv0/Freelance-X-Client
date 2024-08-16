import React, { useState } from 'react';
import toastr from 'toastr';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from '../../../style/loading';
import { changePassword } from '../../../api/user/AuthuserServices';
import { isValidatePassword } from '../../../utility/Validator';
import { useNavigate } from 'react-router-dom';

interface ForgetPasswordProps {
  email:string
}

const Forgetform: React.FC<ForgetPasswordProps> = ({email }) => {
  const [password,setPassword]=useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate=useNavigate()


  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkpassword=isValidatePassword(password)
    if(password!==confirmPassword){
      return toastr.error('Password not match')
    }
    if(!checkpassword){
      return toastr.error('Password must be at least 6 characters long and contain one uppercase letter, one number, and one special character.')
    }
    try{
      const response= await changePassword(email,password)
      if(response=="User Details Changed"){
        toastr.success("User Details Changed")
        navigate('/')
      }else{
        toastr.error('Something wrong in change password')
      }
    }catch(err){
      console.log(err);
      
    }
  };

  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-gray-900 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-black">
              Change Password
            </h3>
          </div>

          <div className="p-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
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
              
         <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
      {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loading />
          </div>
        )}
    </div>
  );
};

export default Forgetform;
