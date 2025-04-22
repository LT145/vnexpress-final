import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface AdvertisementData {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: string;
  displayPlace: string;
}

export async function GET() {
  try {
    const advertisements = await prisma.advertisement.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        targetUrl: true,
        status: true,
        createdAt: true
      }
    });
    return NextResponse.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json(
      { message: 'Không thể lấy dữ liệu quảng cáo' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: AdvertisementData = await request.json();


    const advertisement = await prisma.advertisement.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl,
        position: data.position,
        displayPlace: data.displayPlace,
        status: 'ACTIVE'
      }
    });

    return NextResponse.json(advertisement, { status: 201 });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    return NextResponse.json(
      { message: 'Không thể tạo quảng cáo' },
      { status: 500 }
    );
  }
}