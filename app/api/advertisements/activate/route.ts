import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    return NextResponse.json(advertisement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Không thể kích hoạt quảng cáo' }, { status: 500 });
  }
}