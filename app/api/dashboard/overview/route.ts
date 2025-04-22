import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Lấy tổng số người dùng, bài viết, bình luận, quảng cáo đang chạy
  const [userCount, postCount, commentCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    //prisma.ad.count(),
  ]);

  // Lấy thống kê theo tháng (giả sử có trường createdAt cho các bảng)
  // Ví dụ: lấy số lượng user, post, comment theo từng tháng trong 5 tháng gần nhất
  const now = new Date();
  const months = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  const stats = await Promise.all(
    months.map(async ({ year, month }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const [users, posts, comments] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: start, lt: end } } }),
        prisma.post.count({ where: { createdAt: { gte: start, lt: end } } }),
        prisma.comment.count({ where: { createdAt: { gte: start, lt: end } } }),
      ]);
      return {
        name: `Tháng ${month}`,
        users,
        posts,
        comments,
      };
    })
  );

  return NextResponse.json({
    userCount,
    postCount,
    commentCount,
    //adCount,
    stats,
  });
}