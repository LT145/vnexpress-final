import React, { useEffect, useState, useRef } from "react";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import OTP from "./OTP";
import Image from "next/image"; // Import the Image component from next/image

interface RegisterFormProps {
  email: string;
  onBack: () => void;
  type: 'SIGN_UP' | 'SIGN_IN';
  schema?: any;
  defaultValues?: any;
  onSubmit?: (values: any) => Promise<any>;
}

const RegisterForm = ({ email, onBack }: RegisterFormProps) => {
  const [userEmail, setUserEmail] = useState(email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const containerRef = useRef(null);
  const [emailError, setEmailError] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [fullName, setFullName] = useState("");
  // Remove unused variables
  // const [passwordError, setPasswordError] = useState("");
  // const isFullNameValid = fullName.trim().split(" ").length >= 2;

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      letter: /[a-z]/.test(password) && /[A-Z]/.test(password),
      number: /\d/.test(password),
    };
  };

  const requirements = validatePassword(password);
  const isPasswordValid = requirements.length && requirements.letter && requirements.number;

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setErrorConfirmPassword("Mật khẩu không khớp!");
    } else {
      setErrorConfirmPassword("");
    }
  }, [password, confirmPassword]);

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      // Remove unused assignment
      // setPasswordError("Mật khẩu nhập lại không khớp.");
    } else {
      // Remove unused assignment
      // setPasswordError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!isPasswordValid) {
      setShowRequirements(true);
    }
  };

  useEffect(() => {
    if (isPasswordValid) {
      setShowRequirements(false);
    }
  }, [isPasswordValid]);

  useEffect(() => {
    setIsFormValid(fullName.trim() !== "" && isPasswordValid && confirmPassword === password);
  }, [fullName, isPasswordValid, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        // Gọi API kiểm tra email
        const response = await fetch('/api/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        });
        
        const data = await response.json();
        
        if (data.exists) {
          setEmailError('Email đã được sử dụng');
        } else {
          setShowOTP(true);
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailError('Đã xảy ra lỗi khi kiểm tra email');
      }
    }
  };

  // Move this condition before the return statement
  if (showOTP) {
    return (
      <OTP 
        email={userEmail} 
        fullname={fullName} 
        password={password} 
        onBack={() => setShowOTP(false)}
        onSuccess={() => {}}
        onClose={() => setShowOTP(false)}
      />
    );
  }

  return (
    <div className="bg-white w-full max-w-md mx-auto p-8 rounded-lg relative">
      <button
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
        onClick={onBack}
      >
        <ArrowLeftIcon className="h-6 w-6 text-gray-500" />
      </button>
      <div className="bg-white flex justify-center items-center mb-6 rounded-t-lg w-full">
        <Image
          src="https://s1.vnecdn.net/vnexpress/restruct/i/v824/v2_2019/pc/graphics/logo.svg"
          alt="VnExpress logo"
          width={160} // Specify width
          height={160} // Specify height
          className="h-10"
          unoptimized
        />
      </div>

      <h2 className="text-center text-gray-500 text-2xl font-semibold mb-6">
        Tạo tài khoản
      </h2>
      <form onSubmit={handleSubmit} className="text-left">
        <div className="mb-4 text-left">
          <label className="block mb-2 text-gray-500 text-left" htmlFor="myvne_email_input">
            Email
          </label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            name="myvne_email"
            id="myvne_email_input"
            placeholder="Nhập Email của bạn"
          />
        </div>

        <div className="mb-4 text-left">
          <label className="block mb-2 text-gray-500 text-left" htmlFor="full_name_input">
            Họ và Tên
          </label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
            type="text"
            id="full_name_input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập Họ và Tên của bạn"
            required
          />
        </div>

        <div className="mb-4 relative" ref={containerRef}>
          <label className="block mb-2 text-gray-500" htmlFor="myvne_password_input">
            Mật khẩu
          </label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type={showPassword ? "text" : "password"}
            id="myvne_password_input"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => setShowRequirements(true)}
          />

          <span
            className="absolute right-3 -bottom-1 transform -translate-y-1/2 cursor-pointer"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-6 w-6 text-gray-500" />
            ) : (
              <EyeIcon className="h-6 w-6 text-gray-500" />
            )}
          </span>

          {showRequirements && (
            <div 
              ref={containerRef}
              className="absolute left-1/2 -translate-x-1/2 w-96 justify-center bg-white p-4 rounded shadow-lg text-sm text-gray-400 mt-2 z-10"
            >
              <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>
              <p>Để bảo mật tài khoản của bạn, mật khẩu cần có:</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    className={`h-5 w-5 ${
                      requirements.length ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  8 Ký tự hoặc nhiều hơn
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    className={`h-5 w-5 ${
                      requirements.letter ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  Chữ in & chữ thường
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    className={`h-5 w-5 ${
                      requirements.number ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  Ít nhất một số
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block mb-2 text-gray-500" htmlFor="myvne_confirm_password_input">
            Nhập lại mật khẩu
          </label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type={showConfirmPassword ? "text" : "password"}
            id="myvne_confirm_password_input"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Nhập lại mật khẩu"
          />
          <span
            className="absolute right-3 -bottom-1 transform -translate-y-1/2 cursor-pointer"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-6 w-6 text-gray-500" />
            ) : (
              <EyeIcon className="h-6 w-6 text-gray-500" />
            )}
          </span>
          
        </div>
        {errorConfirmPassword && (
            <div className="text-red-500 text-sm mt-1 ">{errorConfirmPassword}</div>
          )}
          {emailError && (
            <div className="text-red-500 text-sm mt-1">{emailError}</div>
          )}
        <button
          className={`w-full py-2 rounded-lg mb-4 ${
            isFormValid ? "bg-[#8f1c44] text-white hover:bg-[#7a1839]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          type="submit"
          disabled={!isFormValid}
        >
          Tạo Tài Khoản
        </button>
      </form>


      <p className="text-center text-gray-500 text-sm">
        Tiếp tục là đồng ý với{" "}
        <a href="https://vnexpress.net/dieu-khoan-su-dung" target="_blank" rel="noopener noreferrer" className="text-blue-500">
          điều khoản sử dụng
        </a>{" "}
        và{" "}
        <a href="https://vnexpress.net/chinh-sach-bao-mat" target="_blank" rel="noopener noreferrer" className="text-blue-500">
          chính sách bảo mật
        </a>{" "}
        của VnExpress. Tài khoản của bạn được reCAPTCHA bảo vệ.
      </p>
    </div>
  );
};

export default RegisterForm;