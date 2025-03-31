import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { userId, gender, address, phone, birthDate, avatar, name } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện thao tác này" },
        { status: 401 }
      );
    }

    // Check if user exists first
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!" },
        { status: 401 }
      );
    }

    // Update user information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        avatar: avatar || undefined,
      },
    });

    // Update profile information
    const updatedProfile = await prisma.profile.upsert({
      where: {
        userId: userId,
      },
      update: {
        gender: gender || undefined,
        address: address || undefined,
        phone: phone || undefined,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      },
      create: {
        userId: userId,
        gender: gender || null,
        address: address || null,
        phone: phone || null,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      profile: updatedProfile
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Cập nhật thông tin thất bại!" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}