import React, { useState } from 'react';
import Image from "next/image"; // Import the Image component from next/image

interface AuthenticationProps {
  email: string;
  onClose: () => void;
  onBack: () => void;
}

const Authentication = ({ email, onClose, onBack }: AuthenticationProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        avatar: data.user.avatar,
        role: data.user.role,
        token: data.token,
        createdAt: new Date(data.user.createdAt).toLocaleDateString('vi-VN', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        })
      }));

      // Close modal
      onClose();
      
      // Reload the page to update all components
      window.location.reload();

    } catch (error: any) {
      setError(error.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto p-8 rounded-lg relative">
      <div className="bg-white flex justify-center items-center mb-6 p-4 rounded-t-lg w-full">
        <Image 
          src="https://s1.vnecdn.net/vnexpress/restruct/i/v824/v2_2019/pc/graphics/logo.svg" 
          alt="VnExpress logo" 
          width={40} // Specify width
          height={40} // Specify height
          className="h-10" 
          unoptimized
        />
      </div>
      <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700">
        <i className="fas fa-arrow-left"></i>
      </button>
      <h2 className="text-center text-gray-500 text-2xl font-semibold mb-6">Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-gray-500">Email</label>
          <div className="text-gray-500 mb-4">{email}</div>
          <label className="block mb-2 text-gray-500">Mật khẩu</label>
          <input
            type="password"
            className="w-full px-4 py-2 text-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            disabled={isLoading}
          />
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded-lg mb-4 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#8f1c44] hover:bg-[#7a1839]'
          } text-white`}
          disabled={isLoading}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default Authentication;