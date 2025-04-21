import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { z, ZodType } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";  // Added SubmitHandler here
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { FieldValues } from "react-hook-form";
import { AuthActionResult } from "../types/types";
import { getSession } from "next-auth/react";
import RegisterForm from "./RegisterForm";
import Image from "next/image"; // Ensure Image is imported
import { X } from "lucide-react"; // Add this import

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
});

interface Props<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<AuthActionResult>;
  onClose: () => void;
  error?: string;
}

const AuthForm = <T extends FieldValues>({
  onClose = () => {},
  error,
}: Props<T>) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Keep this line
  
  // Remove the error state variable
  // const [error, setError] = useState<string | undefined>("");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin: SubmitHandler<LoginFormValues> = async (values) => {
    // Remove the call to setError
    // setError("");
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false
        });

        if (result?.error) {
          // Handle error appropriately, e.g., display a message
          console.error(result.error);
        } else {
          const session = await getSession();
          if (session?.user.role === 'ADMIN') {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
          onClose();
        }
      } catch {
        // Handle error appropriately, e.g., display a message
        console.error("Đăng nhập thất bại");
      }
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', { redirect: false });
      if (result?.error) {
        console.error(result.error);
      } else {
        const session = await getSession();
        if (session?.user.role === 'ADMIN') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
        onClose();
      }
    } catch {
      console.error('Đăng nhập Google thất bại');
    }
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto p-8 rounded-lg relative border border-gray-200">
      {/* Add close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>



      <div className="bg-white flex justify-center items-center mb-6 p-4 rounded-t-lg w-full">
        <Image 
          src="https://s1.vnecdn.net/vnexpress/restruct/i/v824/v2_2019/pc/graphics/logo.svg" 
          alt="VnExpress logo" 
          width={140} // Specify width
          height={140} // Specify height
          className="h-10" 
          unoptimized
        />
      </div>

      <h2 className="text-center text-gray-500 text-2xl font-semibold mb-6">
        Đăng nhập
      </h2>
            {/* Error message */}
            {error === 'OAuthAccountNotLinked' && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg">
          <p className="text-center text-sm font-medium text-red-600">
            Tài khoản Google này đã được liên kết với một tài khoản khác. Vui lòng đăng nhập bằng email và mật khẩu.
          </p>
        </div>
      )}
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <div className="mb-4">
          <label className="block mb-2 text-gray-500">Email</label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            {...form.register("email")}
            disabled={isPending}
            placeholder="Nhập Email của bạn"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-gray-500">Mật khẩu</label>
          <input
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            {...form.register("password")}
            disabled={isPending}
            placeholder="Nhập mật khẩu"
          />
        </div>
      
        <button
          className={`w-full py-2 rounded-lg mb-4 cursor-pointer ${
            isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8f1c44] text-white'
          }`}
          type="submit"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Đăng nhập"}
        </button>
      </form>

      <div className="flex items-center justify-center mb-4">
        <hr className="w-full border-gray-300" />
        <span className="px-2 text-gray-500">Hoặc</span>
        <hr className="w-full border-gray-300" />
      </div>

      <div className="flex justify-between mb-6">
        <button 
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-1/3 text-gray-500 bg-white border rounded-lg py-2"
        >
          <Image 
            src="https://s1.vnecdn.net/myvne/i/v350/ls/icons/icon-google.svg" 
            alt="Google logo" 
            width={40} 
            height={40} 
            className="h-5 mr-2" 
            unoptimized
          />
          <span>Google</span>
        </button>
        <button 
          onClick={() => signIn('facebook')}
          className="flex items-center justify-center w-1/3 text-gray-500 bg-white border rounded-lg py-2 mx-2"
        >
          <Image 
            src="https://s1.vnecdn.net/myvne/i/v350/ls/icons/icon-facebook.svg" 
            alt="Facebook logo" 
            width={20} // Specify width
            height={20} // Specify height
            className="h-5 mr-2" 
            unoptimized
          />
          <span>Facebook</span>
        </button>
        <button 
          onClick={() => signIn('apple')}
          className="flex items-center justify-center w-1/3 text-gray-500 bg-white border rounded-lg py-2"
        >
          <Image 
            src="https://s1.vnecdn.net/myvne/i/v350/ls/icons/icon-apple.svg" 
            alt="Apple logo" 
            width={20} // Specify width
            height={20} // Specify height
            className="h-5 mr-2" 
            unoptimized
          />
          <span>Apple</span>
        </button>
      </div>

      <p className="text-center text-gray-500 text-sm">
        Tiếp tục là đồng ý với <a href="https://vnexpress.net/dieu-khoan-su-dung" target="_blank" className="text-blue-500">điều khoản sử dụng</a> và <a href="https://vnexpress.net/chinh-sach-bao-mat" target="_blank" className="text-blue-500">chính sách bảo mật</a> của VnExpress. Tài khoản của bạn được reCAPTCHA bảo vệ.
      </p>
      <div className="text-center mt-4">
        <button 
          onClick={() => setShowRegisterModal(true)}
          className="text-[#8f1c44] font-medium hover:underline"
        >
          Tạo tài khoản
        </button>
        
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg relative">
              <RegisterForm 
                email="" 
                onBack={() => setShowRegisterModal(false)}
                type="SIGN_UP"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
