import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          {
            categories: {
              some: {
                name: params.name
              }
            }
          },
          {
            status: 'PUBLISHED'
          }
        ]
      },
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
    console.error('Lỗi khi lấy danh sách bài viết theo category:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách bài viết theo category' },
      { status: 500 }
    );
  }
}