import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface OTPProps {
  email?: string;
  password?: string;
  fullname?: string;
  onBack?: () => void;
  onSuccess: () => void;
  onClose: () => void;
}

const OTP = ({ email, password, fullname, onBack, onSuccess, onClose }: OTPProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    sendOtp();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = async () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setCountdown(60);
    setCanResend(false);

    try {
      const response = await fetch("/api/OTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: newOtp }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ OTP đã được gửi!");
      } else {
        setError("❌ Lỗi gửi OTP: " + data.error);
      }
    } catch (error) {
      setError("❌ Lỗi kết nối server!");
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Vui lòng nhập mã OTP!");
      return;
    }

    if (otp === generatedOtp) {
      setIsVerified(true);

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email, 
            fullname, 
            password,
            verified: true 
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Tạo tài khoản thành công!');
          onSuccess();
          if (email && fullname) {
            // Lưu vào session bằng next-auth
            const signInResponse = await signIn('credentials', {
              email,
              password,
              redirect: false,
              callbackUrl: '/'
            }) as { ok: boolean; error?: string; url?: string };
            
            if (!signInResponse) {
              setError('❌ Lỗi khi đăng nhập sau đăng ký: Không nhận được phản hồi');
              return;
            }
            
            if (signInResponse.ok) {
              router.push("/");
              onClose();
              window.location.reload();
            } else {
              setError(`❌ Lỗi khi đăng nhập sau đăng ký: ${signInResponse.error || 'Không xác định'}`);
              console.error('Lỗi đăng nhập:', signInResponse.error);
            }
          }
        } else {
          setError("❌ Lỗi khi đăng ký tài khoản: " + data.error);
        }
      } catch (error) {
        setError("❌ Lỗi kết nối đến server!");
        console.error("Lỗi API register:", error);
      }
    } else {
      setError("Mã OTP không đúng. Vui lòng thử lại!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-auto p-8 rounded-lg relative">
        <button
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          onClick={onClose || onBack}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>

        <h2 className="text-center text-gray-500 text-2xl font-semibold mb-4">
          Nhập mã OTP
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Mã xác nhận đã được gửi đến <b>{email}</b>
        </p>

        <input
          type="text"
          className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <button
          className="w-full py-2 mt-4 rounded-lg cursor-pointer bg-[#8f1c44] text-white hover:bg-[#7a1839] transition-colors"
          onClick={handleVerifyOtp}
        >
          Xác nhận OTP
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          {countdown > 0 ? `Gửi lại OTP sau ${countdown}s` : "Bạn có thể gửi lại OTP"}
        </p>

        <button
          className={`w-full py-2 mt-2 rounded-lg transition-colors ${
            canResend 
              ? "bg-blue-500 text-white hover:bg-blue-600" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={sendOtp}
          disabled={!canResend}
        >
          Gửi lại OTP
        </button>
      </div>
    </div>
  );
};

export default OTP;
