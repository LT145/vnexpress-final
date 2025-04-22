"use client";

import { Card } from "@/components/ui/card";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";

const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse" />
  }
);

const DashboardPage = () => {
  const [overview, setOverview] = useState({
    userCount: 0,
    postCount: 0,
    commentCount: 0,
    adCount: 0,
    stats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/overview");
        const data = await res.json();
        setOverview(data);
      } catch (e) {
        console.error(e);
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tổng quan hệ thống</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng số người dùng</h3>
          <p className="mt-2 text-3xl font-bold">{loading ? "..." : overview.userCount.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng số bài viết</h3>
          <p className="mt-2 text-3xl font-bold">{loading ? "..." : overview.postCount.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng số bình luận</h3>
          <p className="mt-2 text-3xl font-bold">{loading ? "..." : overview.commentCount.toLocaleString()}</p>
        </Card>
        {/* <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Quảng cáo đang chạy</h3>
          <p className="mt-2 text-3xl font-bold">{loading ? "..." : overview.adCount.toLocaleString()}</p>
        </Card> */}
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Thống kê hoạt động</h3>
        <div className="h-[400px] w-full">
          {loading ? (
            <div className="h-[400px] w-full bg-gray-100 animate-pulse" />
          ) : (
            <BarChart
              width={800}
              height={400}
              data={overview.stats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="users" 
                fill="#8884d8" 
                name="Người dùng mới"
                isAnimationActive={false}
              />
              <Bar 
                dataKey="posts" 
                fill="#82ca9d" 
                name="Bài viết mới"
                isAnimationActive={false}
              />
              <Bar 
                dataKey="comments" 
                fill="#ffc658" 
                name="Bình luận mới"
                isAnimationActive={false}
              />
            </BarChart>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;