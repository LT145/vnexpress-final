import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        reporter: { select: { name: true } },
        post: { 
          select: { 
            title: true,
            content: true,
            imageUrls: true,// Add this line     // Add this line
            createdAt: true    // Add this line
          }
        },
        comment: { select: { content: true } }
      }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, hideContent } = await request.json();
    
    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update report status
    const updatedReport = await prisma.report.update({
      where: { id: params.id },
      data: { status },
    });

    // If status is ACCEPTED and hideContent is true
    if (status === 'ACCEPTED' && hideContent) {
      if (updatedReport.type === 'POST' && updatedReport.postId) {
        // Hide the post
        await prisma.post.update({
          where: { id: updatedReport.postId },
          data: { status: 'DELETED' },
        });
      } else if (updatedReport.type === 'COMMENT' && updatedReport.commentId) {
        // Hide the comment
        await prisma.comment.update({
          where: { id: updatedReport.commentId },
          data: { status: 'REJECTED' },
        });
      }
    }

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}