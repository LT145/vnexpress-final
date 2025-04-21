import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: { select: { name: true } },
        post: { select: { title: true } },
        comment: { select: { content: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}