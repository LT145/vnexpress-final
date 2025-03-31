import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, fullname, password, verified } = await request.json();

    if (!email || !fullname || !password) {
      return NextResponse.json(
        { error: "Thiếu thông tin đăng ký!" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng!" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name: fullname,
        password: hashedPassword,
      }
    });

    return NextResponse.json(
      { message: "Đăng ký thành công!", user: { email: user.email, name: user.name } },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Lỗi khi đăng ký tài khoản!" },
      { status: 500 }
    );
  }
}