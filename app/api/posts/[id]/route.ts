import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // params đã được giải quyết, không cần await
  const { id } = params;
  const postId = Number(id);

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { name: true } },
      categories: true
    }
  });

  if (!post) {
    return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });
  }

  return NextResponse.json(post);
}




export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // Await the promise to get the id
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Thiếu ID bài viết" },
        { status: 400 }
      );
    }

    const { title, content, status, categoryId } = await request.json();
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "ID bài viết không hợp lệ" },
        { status: 400 }
      );
    }

    // Kiểm tra nếu bài viết tồn tại
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Bài viết không tồn tại" }, { status: 404 });
    }

    // Cập nhật bài viết
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        status: status || "DRAFT",
        published: status === "PUBLISHED" ? true : false,
        publishedAt: new Date(),
        categories: {
          set: [],
          connect: [{ id: categoryId }]
        }
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Lỗi cập nhật bài viết:", error);
    return NextResponse.json({ error: "Lỗi cập nhật bài viết" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED' | undefined;
    const categoryId = formData.get('categoryId') as string;
    
    if (status && !['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED'].includes(status)) {
      return NextResponse.json(
        { error: 'Trạng thái bài viết không hợp lệ' },
        { status: 400 }
      );
    }

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
        published: false,
        status:  'DRAFT',
        authorId: session.user.id,
        categories: {
          connect: [{ id: categoryId }]
        }
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