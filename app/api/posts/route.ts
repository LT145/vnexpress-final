import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { auth } from '@/auth';

export async function GET(request: Request, { params }: { params: { id: number } }) {
  try {
    if (params?.id) {
      console.log('ID bài viết:', params.id);
      const post = await prisma.post.findUnique({
        where: { id: params.id },
        include: {
          author: {
            select: {
              name: true
            }
          },
          categories: true
        }
      });
      
      if (!post) {
        return NextResponse.json(
          { error: 'Không tìm thấy bài viết' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(post);
    }
    
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        },
        categories: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách bài viết' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: number } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!params?.id) {
      return NextResponse.json(
        { error: 'Thiếu ID bài viết' },
        { status: 400 }
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

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        status: status || 'DRAFT',
        categories: {
          set: [{ id: categoryId }]
        }
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Lỗi khi cập nhật bài viết:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật bài viết' },
      { status: 500 }
    );
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