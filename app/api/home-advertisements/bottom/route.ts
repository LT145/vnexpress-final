import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const advertisements = await prisma.advertisement.findMany({
      where: { displayPlace: 'home', status: 'ACTIVE', position: 'bottom' },
      select: {
        imageUrl: true,
        title: true,
        description: true,
        targetUrl: true,
      },
    });

    if (advertisements.length === 0) {
      return NextResponse.json(null);
    }

    const randomIndex = Math.floor(Math.random() * advertisements.length);
    const advertisement = advertisements[randomIndex];
    return NextResponse.json(advertisement);
  } catch (error) {
    console.error('Error fetching home advertisement:', error);
    return NextResponse.json(
      { message: 'Không thể lấy dữ liệu quảng cáo trang chủ' },
      { status: 500 }
    );
  }
}