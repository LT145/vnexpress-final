import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request,) {
  try {
    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
        post: {
          select: {
            title: true,
          },
        },
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Format the response to include full timestamp
    const formattedComments = comments.map(comment => ({
      ...comment,
      author: comment.author.name,
      postTitle: comment.post.title,
      createdAt: comment.createdAt.toISOString(), // Ensure full timestamp
    }));

    return NextResponse.json(formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error, request);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}