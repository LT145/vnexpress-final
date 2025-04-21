import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { postId, userId, reason, notes } = await request.json();

    if (!postId || !userId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        reason,
        notes: notes || null,
        status: 'PENDING',
        type: 'POST', // Add this line
        post: {
          connect: { id: Number(postId) }
        },
        reporter: {
          connect: { id: userId }
        }
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}