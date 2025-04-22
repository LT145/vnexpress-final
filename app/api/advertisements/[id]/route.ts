import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RequestBody {
  status: 'PAUSED' | 'ACTIVE';
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status }: RequestBody = await request.json();

    if (status !== 'PAUSED' && status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Trạng thái không hợp lệ' },
        { status: 400 }
      );
    }

    const updatedAdvertisement = await prisma.advertisement.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedAdvertisement);
  } catch (error) {
    console.error('Lỗi khi tạm dừng quảng cáo:', error);
    return NextResponse.json(
      { error: 'Không thể tạm dừng quảng cáo' },
      { status: 500 }
    );
  }
}