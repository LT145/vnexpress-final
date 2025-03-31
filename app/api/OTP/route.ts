import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Thiếu email hoặc OTP!" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "loc42286@gmail.com",
        pass: "dosi orae etfg vnsb",
      },
    });

    const mailOptions = {
      from: "loc42286@gmail.com",
      to: email,
      subject: "Mã OTP của bạn",
      text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 30 giây.`,
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json(
      { message: "OTP đã được gửi!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    return NextResponse.json(
      { error: "Không thể gửi OTP!" },
      { status: 500 }
    );
  }
}
