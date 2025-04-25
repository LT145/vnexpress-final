import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Validate request body
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { adId } = await request.json();

    // Validate adId
    if (!adId) {
      return NextResponse.json(
        { error: 'adId is required' },
        { status: 400 }
      );
    }

    await prisma.adMetric.create({
      data: {
        adId,
        type: 'IMPRESSION',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording impression:', error);
    return NextResponse.json(
      { error: 'Failed to record impression' },
      { status: 500 }
    );
  }
}