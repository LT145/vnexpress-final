"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import AuthForm from "./auth-form";
import { signInSchema } from "@/lib/validation";
import { HeaderProvider } from "../context/HeaderContext";
import Image from "next/image"; // Import the Image component from next/image



const Header =  () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState("");
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    // Session sẽ được tự động cập nhật bởi next-auth
  }, [session]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data.map((category: {name: string}) => category.name));
        setVisibleItems(data.slice(0, 10).map((category: {name: string}) => category.name));
        setHiddenItems(data.slice(10).map((category: {name: string}) => category.name));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Có thể thêm UI thông báo lỗi ở đây nếu cần
      } finally {
        // Có thể thêm loading state ở đây nếu cần
      }
    };

    if (categories.length === 0) {
      (async () => {
        await fetchCategories();
      })();
    }
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setShowDropdown(false);
      await router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      // Xử lý lỗi đăng xuất nếu cần
    }
  };

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
      const day = days[now.getDay()];
      const date = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      setCurrentDate(`${day}, ${date}/${month}/${year}`);
    };

    updateDate();
    const timer = setInterval(updateDate, 1000);
    return () => clearInterval(timer);
  }, [setCurrentDate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data.map((category: {name: string}) => category.name));
        setVisibleItems(data.slice(0, 10).map((category: {name: string}) => category.name));
        setHiddenItems(data.slice(10).map((category: {name: string}) => category.name));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, setCategories, setVisibleItems, setHiddenItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Removed duplicate handleLogout function

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
      const day = days[now.getDay()];
      const date = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      setCurrentDate(`${day}, ${date}/${month}/${year}`);
    };

    updateDate();
    const timer = setInterval(updateDate, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <HeaderProvider>
      <div className="bg-white">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <header className="border-b">
          <div className="container mx-auto flex justify-between items-center py-2">
            <div className="flex items-center">
              <button onClick={() => router.push("/")}>
                <Image
                  src="https://s1.vnecdn.net/vnexpress/restruct/i/v9559/v2_2019/pc/graphics/logo.svg"
                  alt="VNExpress logo"
                  className="mr-2"
                  width={150}
                  height={28}
                  unoptimized
                />
              </button>
            </div>
            <div className="text-gray-500 text-sm">{currentDate}</div>
            {user ? (
              <div className="relative z-100" ref={dropdownRef}>
                <button
                  className="text-gray-500 text-sm flex items-center px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  👤 {user.name} <i className="fas fa-chevron-down ml-2"></i>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 z-50 bg-white border rounded-lg shadow-lg">
                    <button 
                      onClick={() => {
                        router.push("/profile");
                        setShowDropdown(false);
                      }} 
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Thông tin cá nhân
                    </button>
                    {user && ["ADMIN", "EDITOR", "MODERATOR", "ADVERTISER"].includes(user.role) && (
                      <button
                        onClick={() => {
                          router.push("/dashboard");
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100 cursor-pointer"
                      >
                        Trang quản trị
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        router.push("/post");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Đăng bài viết
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Thông báo
                    </button>
                    <button
                      onClick={() => {
                        router.push("/saved-posts");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Tin đã lưu
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-500 text-sm cursor-pointer"
              >
                <i className="fas fa-user mr-1"></i> Đăng nhập
              </button>
            )}
          </div>
        </header>
        {showLogin && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
            <div className="relative bg-white rounded-lg shadow-lg">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowLogin(false)}
              >
                <i className="fas fa-times"></i>
              </button>
              <AuthForm 
                type="SIGN_IN"
                schema={signInSchema}
                defaultValues={{
                  email: "",
                  password: ""
                }}
                onSubmit={async (values) => {
                  try {
                    const result = await signIn("credentials", {
                      email: values.email,
                      password: values.password,
                      redirect: false
                    });
                    if (result?.error) {
                      return { success: false, error: result.error };
                    }
                    return { success: true, error: undefined };
                  } catch (error) {
                    console.error("Sign-in error:", error);
                    return { success: false, error: "Đăng nhập thất bại" };
                  }
                }}
                onClose={() => setShowLogin(false)} 
              />
            </div>
          </div>
        )}
        <nav className="border-b">
          <div className="container mx-auto flex items-center justify-between py-2 px-4">
            <a href="#" className="text-gray-500 text-sm flex items-center">
              <i className="fas fa-home mr-1"></i>
            </a>
            <div className="hidden md:flex space-x-4">
              {visibleItems.map((item, index) => (
                <a key={index} href="#" className="text-gray-500 text-sm">
                  {item}
                </a>
              ))}
            </div>
            {hiddenItems.length > 0 && (
              <div className="relative">
                <button className="text-gray-500 text-lg cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                  <i className="fas fa-bars"></i>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                    {hiddenItems.map((item, index) => (
                      <a key={index} href="#" className="block px-4 py-2 text-gray-500 text-sm hover:bg-gray-100">
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </HeaderProvider>
  );
};

export default Header;
