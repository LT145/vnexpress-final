import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);


  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const startResendCooldown = () => {
    setCanResend(false);
    setTimeout(() => {
      setCanResend(true);
    }, 60000); // 60 giây
  };

  const sendOtp = useCallback(async () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    startResendCooldown();

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
  }, [email]);

  const hasSentRef = useRef(false);

  useEffect(() => {
    if (!hasSentRef.current) {
      hasSentRef.current = true;
      sendOtp(); // ✅ Chỉ gửi đúng 1 lần
    }
  }, [sendOtp]);
  

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

    if (otp !== generatedOtp) {
      setError("Mã OTP không đúng. Vui lòng thử lại!");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullname, password, verified: true }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Tạo tài khoản thành công!");
        onSuccess();

        if (email && password) {
          const signInResponse = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/",
          }) as { ok: boolean; error?: string; url?: string };

          if (signInResponse?.ok) {
            router.push("/");
            onClose();
            window.location.reload();
          } else {
            setError(`❌ Lỗi khi đăng nhập: ${signInResponse?.error || "Không xác định"}`);
          }
        }
      } else {
        setError("❌ Lỗi khi đăng ký tài khoản: " + data.error);
      }
    } catch (error) {
      setError("❌ Lỗi kết nối đến server!");
      console.error("Lỗi API register:", error);
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

        <button
          className={`w-full py-2 mt-4 rounded-lg transition-colors ${
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
