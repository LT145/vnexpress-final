import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const postId = Number(resolvedParams.id); // Convert ID to number

    if (isNaN(postId)) {
      console.error(`Invalid ID: ${resolvedParams.id}`);
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    console.log(`🔍 Searching for post with ID: ${postId}`);
    
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { name: true } },
        categories: true
      }
    });

    if (!post) {
      console.error(`⛔ Post not found with ID: ${postId}`);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    console.log(`✅ Post found:`, post);
    return NextResponse.json(post);
  } catch (error) {
    console.error('❌ Error fetching post:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
