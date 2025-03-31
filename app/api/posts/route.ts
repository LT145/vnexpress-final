import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { title, content, status } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Tiêu đề và nội dung là bắt buộc' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        status: 'DRAFT', // Set default status if not provided
        authorId: 'default-author-id' // TODO: Thay thế bằng ID người dùng từ session
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Lỗi khi tạo bài viết:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo bài viết' },
      { status: 500 }
    );
  }
}