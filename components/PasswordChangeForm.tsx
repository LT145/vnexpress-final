"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

type PasswordValidation = {
  length: boolean;
  letter: boolean;
  number: boolean;
};

const PasswordChangeForm = () => {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const validatePassword = (password: string): PasswordValidation => {
    return {
      length: password.length >= 8,
      letter: /[a-z]/.test(password) && /[A-Z]/.test(password),
      number: /\d/.test(password),
    };
  };

  const isPasswordValid = (password: string): boolean => {
    const validation = validatePassword(password);
    return validation.length && validation.letter && validation.number;
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (!isPasswordValid(e.target.value)) {
      setShowRequirements(true);
    } else {
      setShowRequirements(false);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== newPassword) {
      setError("Mật khẩu nhập lại không khớp.");
    } else {
      setError("");
    }
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Có lỗi khi gửi OTP');
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
      console.error('Error:', err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'OTP không hợp lệ');
      } else {
        setOtpVerified(true);
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
      console.error('Error:', err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!isPasswordValid(newPassword)) {
      setError("Mật khẩu mới không đáp ứng yêu cầu.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          email: session?.user?.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Có lỗi xảy ra khi đổi mật khẩu');
      } else {
        setSuccess('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto p-8 rounded-lg">
      <h2 className="text-center text-gray-500 text-2xl font-semibold mb-6">
        Đổi mật khẩu
      </h2>

      {!otpSent && !otpVerified && (
        <button
          className="w-full py-2 rounded-lg mb-4 bg-[#8f1c44] text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={handleSendOtp}
          disabled={otpLoading}
        >
          {otpLoading ? 'Đang gửi OTP...' : 'Gửi OTP xác nhận'}
        </button>
      )}

      {otpSent && !otpVerified && (
        <div className="mb-4">
          <label className="block mb-2 text-gray-500" htmlFor="otp">
            Nhập mã OTP
          </label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            className="w-full py-2 rounded-lg mt-4 bg-[#8f1c44] text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={handleVerifyOtp}
            disabled={otpLoading}
          >
            {otpLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
          </button>
        </div>
      )}

      {otpVerified && (

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-gray-500" htmlFor="currentPassword">
            Mật khẩu hiện tại
          </label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-500" htmlFor="newPassword">
            Mật khẩu mới
          </label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
          />
          {showRequirements && (
            <div className="mt-2 text-sm text-gray-500">
              <p>Mật khẩu phải đáp ứng các yêu cầu sau:</p>
              <ul className="list-disc pl-5">
                <li className={validatePassword(newPassword).length ? 'text-green-500' : 'text-red-500'}>
                  Ít nhất 8 ký tự
                </li>
                <li className={validatePassword(newPassword).letter ? 'text-green-500' : 'text-red-500'}>
                  Chứa cả chữ hoa và chữ thường
                </li>
                <li className={validatePassword(newPassword).number ? 'text-green-500' : 'text-red-500'}>
                  Chứa ít nhất một số
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-500" htmlFor="confirmPassword">
            Nhập lại mật khẩu mới
          </label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-sm">{success}</div>}

        <button
          className="w-full py-2 rounded-lg mb-4 bg-[#8f1c44] text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </button>
      </form>
      )}
    </div>
  );
};

export default PasswordChangeForm;