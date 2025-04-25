import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const adId = params.id;

  if (!adId) {
    return NextResponse.json({ message: 'Ad ID is required' }, { status: 400 });
  }

  try {
    // Lấy toàn bộ metric của quảng cáo dựa trên adId
    const metrics = await prisma.adMetric.findMany({
      where: { adId },
      select: {
        type: true,
      },
    });

    console.log('Metrics:', metrics);
    if (!metrics || metrics.length === 0) {
      return NextResponse.json({ message: 'Advertisement metrics not found' }, { status: 404 });
    }

    // Đếm số lần hiển thị (impression) và click
    const impressions = metrics.filter((m: { type: string }) => m.type === 'IMPRESSION').length;
    const clicks = metrics.filter((m: { type: string }) => m.type === 'CLICK').length;

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

    console.log('Impressions:', impressions);
    console.log('Clicks:', clicks);
    return NextResponse.json({
      impressions,
      clicks,
      ctr: ctr.toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching advertisement stats:', error);
    return NextResponse.json({ message: 'Error fetching advertisement stats' }, { status: 500 });
  }
}
