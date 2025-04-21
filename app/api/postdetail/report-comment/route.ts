import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { commentId, userId, reason, notes } = await request.json();

    if (!commentId || !userId || !reason) {
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
        type: 'COMMENT',
        comment: {
          connect: { id: commentId }
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