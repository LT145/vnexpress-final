import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = Number(searchParams.get('postId'));
    const userId = searchParams.get('userId');

    if (!postId || !userId) {
      return NextResponse.json(
        { error: 'Thiếu tham số postId hoặc userId' },
        { status: 400 }
      );
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId
      }
    });

    return NextResponse.json({ isSaved: !!existingLike }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi kiểm tra bài viết đã lưu' },
      { status: 500 }
    );
  }
}