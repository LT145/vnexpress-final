import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { postId, userId } = await request.json();

    await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        likes: {
          disconnect: { id: userId }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to unsave post" },
      { status: 500 }
    );
  }
}