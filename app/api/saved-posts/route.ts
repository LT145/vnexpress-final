import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function DELETE(request: Request) {
  try {
    const { postId, userId } = await request.json();

    await prisma.like.delete({
      where: {
        id: `${userId}_${postId}`
      },
    });

    return NextResponse.json({ message: 'Xóa bài viết khỏi danh sách đã lưu thành công' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa bài viết khỏi danh sách đã lưu' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const savedPosts = await prisma.like.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        post: true
      }
    });

    return NextResponse.json(savedPosts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy danh sách bài viết đã lưu' },
      { status: 500 }
    );
  }
}