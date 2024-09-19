import React, { useRef, useEffect, useState } from 'react';
import { resendOtp, verifyOTP, handleforgetpasswordOtp } from '../../../api/user/AuthuserServices';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import Loading from '../../../style/loading';
import Forgetform from '../forgetpassform/forgetform';

interface OtpProps {
  email: string;
  submitType: string;
}

const Otp: React.FC<OtpProps> = ({ email, submitType }) => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [changePasswordComponent, setPasswordComponent] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const subtype=submitType

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, []);

  const startTimer = () => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value.length === 1 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      e.target.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && !e.currentTarget.value) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOtp = async () => {
    if (otp.join('').length < 4) {
      return toastr.error('Complete the field');
    }
    if (isExpired) {
      toastr.error('OTP has expired');
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOTP(email, otp.join(''));
      if (response.message === 'User verified successfully') {
        toastr.success('User registration successful');
        setTimeout(() => {
          setLoading(false);
          navigate('/login');
        }, 2000);
      } else {
        toastr.error(response.error || 'Verification failed');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      toastr.error('Verification failed');
      console.log(err);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const reSendOtp = async () => {
    setIsExpired(false);
    setLoading(true);
    try {
      const response = await resendOtp(email);
      if (response.message === 'OTP sent successfully') {
        setTimeLeft(120);
        setIsExpired(false);
        startTimer();
        toastr.success(response.message);
      } else {
        toastr.error('Failed to resend OTP');
      }
    } catch (err) {
      toastr.error('Failed to resend OTP');
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const otpForForgetPassword = async () => {
    if (otp.join('').length < 4) {
      return toastr.error('Complete the field');
    }
    setLoading(true);
    try {
      const response = await handleforgetpasswordOtp(email, otp.join(''));
      if (response.message) {
        toastr.success(response.message);
        setPasswordComponent(true);
      } else {
        toastr.error(response);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  return (
       <>
        {changePasswordComponent ? (
       <Forgetform  email={email}/>
        ) : (
      
    <div className="flex items-center justify-center min-h-screen ">
      <div className="relative">
          <>
            <div className="p-6 rounded-lg shadow-lg text-center">
              <h6 className="text-xl font-semibold ">
                Please enter the one-time password to verify your account
              </h6>
              <div>
                <span>A code has been sent to your email</span>
              </div>
              <div id="otp" className="flex justify-center mt-4 space-x-2">
                {[...Array(4)].map((_, index) => (
                  <input
                    key={index}
                    className="w-10 h-10 text-center border border-gray-300 rounded-md"
                    type="text"
                    id={`otp-${index}`}
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    value={otp[index]}
                  />
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={subtype === 'register' ? submitOtp : otpForForgetPassword}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  disabled={submitType === 'register' ? isExpired : false}
                >
                  Validate
                </button>
              </div>
              <div className="mt-2">
                {isExpired ? (
                  <span className="text-red-500">OTP has expired</span>
                ) : (
                  <span>Time left: {formatTime(timeLeft)}</span>
                )}
              </div>
            </div>
            {isExpired && submitType === 'register' && (
              <div className=" mt-4 p-4 rounded-lg shadow-lg flex justify-center items-center">
                <span>Didn't get the code?</span>
                <a
                  onClick={reSendOtp}
                  className="ml-3 text-blue-500 cursor-pointer"
                >
                  Resend
                </a>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white-900 bg-opacity-50">
                <Loading />
              </div>
            )}
          </>
      </div>
    </div>
        )}
     </>
  );
};

export default Otp;
