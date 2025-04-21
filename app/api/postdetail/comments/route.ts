import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { CommentStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    //const status = searchParams.get('status') as CommentStatus;
    
    const comments = await prisma.comment.findMany({
      where: {
        postId: Number(postId),
        status: 'APPROVED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { postId, content, userId } = await request.json();
    
    const comment = await prisma.comment.create({
      data: {
        content,
        status: 'PENDING',
        authorId: userId,
        postId
      }
    });
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}