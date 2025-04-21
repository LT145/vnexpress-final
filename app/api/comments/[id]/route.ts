import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // const commentId = params.id;
    
//     // Add your database deletion logic here
//     // Example: await prisma.comment.delete({ where: { id: commentId } });
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete comment' },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const commentId = params.id;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { status },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update comment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}