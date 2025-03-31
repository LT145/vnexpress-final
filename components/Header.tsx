"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import AuthForm from "./auth-form";
import { signInSchema } from "@/lib/validation";

const menuItems = [
  "Thời sự", "Thế giới", "Kinh doanh", "Công nghệ", "Khoa học", "Video", 
  "Podcasts", "Góc nhìn", "Bất động sản", "Sức khỏe", "Thể thao", "Giải trí", 
  "Pháp luật", "Giáo dục", "Đời sống", "Xe", "Du lịch", "Ý kiến", "Tâm sự"
];

const Header = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleItems, setVisibleItems] = useState(menuItems.slice(0, 10));
  const [hiddenItems, setHiddenItems] = useState(menuItems.slice(10));
  const [currentDate, setCurrentDate] = useState("");
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    // Session sẽ được tự động cập nhật bởi next-auth
  }, [session]);

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
    await signOut({ redirect: false });
    setShowDropdown(false);
    router.push('/');
    router.refresh();
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
  }, []);

  return (
    <div className="bg-white">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center py-2">
          <div className="flex items-center">
            <img
              src="https://s1.vnecdn.net/vnexpress/restruct/i/v9559/v2_2019/pc/graphics/logo.svg"
              alt="VNExpress logo"
              className="mr-2"
              width="150"
              height="28"
            />
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
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                  <button 
                    onClick={() => {
                      router.push("/profile");
                      setShowDropdown(false);
                    }} 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Thông tin cá nhân
                  </button>
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
  );
};

export default Header;
