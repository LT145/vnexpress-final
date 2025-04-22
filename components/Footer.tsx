// components/Footer.jsx
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className=" mt-10 w-full border-t border-gray-300 text-gray-700 text-[13px] leading-[1.3]">
      <div className="container">
      <div className=" mx-auto flex flex-wrap justify-between items-center  py-2">
        <div className="flex items-center space-x-1 mb-2 sm:mb-0">
          <span className="font-semibold">Báo điện tử</span>
          <Image
            alt="Logo letter E in a pink square representing VnExpress"
            className=""
            src="https://s1.vnecdn.net/vnexpress/restruct/i/v9559/v2_2019/pc/graphics/logo.svg"
            width={140}
            height={60}
          />
        </div>
        <div className="flex space-x-3 text-[13px] text-gray-600 mb-2 sm:mb-0 flex-wrap">
          <a className="hover:underline" href="#">
            Điều khoản sử dụng
          </a>
          <span>|</span>
          <a className="hover:underline" href="#">
            Chính sách bảo mật
          </a>
          <span>|</span>
          <a className="hover:underline" href="#">
            Cookies
          </a>
          <span>|</span>
          <a className="hover:underline" href="#">
            RSS
          </a>
          <span>|</span>
          <a className="hover:underline" href="#">
            Theo dõi VnExpress trên
          </a>
          <a
            aria-label="Facebook"
            className="text-gray-600 hover:text-gray-800"
            href="#"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            aria-label="Twitter"
            className="text-gray-600 hover:text-gray-800"
            href="#"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            aria-label="YouTube"
            className="text-gray-600 hover:text-gray-800"
            href="#"
          >
            <i className="fab fa-youtube"></i>
          </a>
          <a
            aria-label="TikTok"
            className="text-gray-600 hover:text-gray-800"
            href="#"
          >
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>

      <div className="mx-auto flex flex-wrap justify-between py-2 text-[13px] leading-[1.3] text-gray-800">
        <div className="w-full sm:w-auto mb-2 sm:mb-0 font-normal">
          <p>
            <strong>Báo tiếng Việt nhiều người xem nhất</strong>
          </p>
          <p>Thuộc Bộ Khoa học và Công nghệ</p>
          <p>
            Số giấy phép: 548/GP-BTTTT do Bộ Thông tin và Truyền thông cấp ngày
            24/08/2021
          </p>
        </div>
        <div className="w-full sm:w-auto text-gray-700">
          <p>
            <strong>Tổng biên tập: Phạm Văn Hiếu</strong>
          </p>
          <p>
            Địa chỉ: Tầng 10, Tòa A FPT Tower, số 10 Phạm Văn Bạch, Dịch Vọng,
            Cầu Giấy, Hà Nội
          </p>
          <p>Điện thoại: 024 7300 8899 - máy lẻ 4500</p>
          <p>Email: webmaster@vnexpress.net</p>
        </div>
        <div className="w-full sm:w-auto text-gray-700 mt-2 sm:mt-0">
          <p>© 1997-2025. Toàn bộ bản quyền thuộc VnExpress</p>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
