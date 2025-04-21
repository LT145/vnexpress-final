import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
interface RequestBody {
  postId: number;
  userId: string;
}


export async function DELETE(request: Request) {
  try {
    const { postId }: RequestBody = await request.json();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: session.user.id
      }
    });

    if (!existingLike) {
      return NextResponse.json({ message: 'Không tìm thấy bài viết đã lưu' }, { status: 404 });
    }

    await prisma.like.deleteMany({
      where: {
        postId,
        userId: session.user.id
      }
    });

    return NextResponse.json({ message: 'Xóa bài viết khỏi danh sách đã lưu thành công' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post from saved list:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa bài viết khỏi danh sách đã lưu' },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
   try {
    const { postId }: RequestBody = await request.json();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the post has already been liked
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: session.user.id
      }
    });

    if (existingLike) {
      return NextResponse.json({ message: 'Bài viết đã được like' }, { status: 200 });
    }

    // Create a new like record
    await prisma.like.create({
      data: {
        postId,
        userId: session.user.id
      }
    });

    return NextResponse.json({ message: 'Like bài viết thành công' }, { status: 201 });
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi like bài viết' },
      { status: 500 }
    );
  }
}