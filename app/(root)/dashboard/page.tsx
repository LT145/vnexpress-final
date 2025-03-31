"use client";

import { Card } from "@/components/ui/card";
import {  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import dynamic from 'next/dynamic';
const data = [
  { name: "Tháng 1", users: 400, posts: 240, comments: 670 },
  { name: "Tháng 2", users: 300, posts: 139, comments: 450 },
  { name: "Tháng 3", users: 200, posts: 980, comments: 1200 },
  { name: "Tháng 4", users: 278, posts: 390, comments: 800 },
  { name: "Tháng 5", users: 189, posts: 480, comments: 900 },
];
const BarChart = dynamic(
    () => import('recharts').then((mod) => mod.BarChart),
    { 
      ssr: false,
      loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse" />
    }
  );
const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tổng quan hệ thống</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng số người dùng</h3>
          <p className="mt-2 text-3xl font-bold">1,234</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng số bài viết</h3>
          <p className="mt-2 text-3xl font-bold">567</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Tổng số bình luận</h3>
          <p className="mt-2 text-3xl font-bold">2,345</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Quảng cáo đang chạy</h3>
          <p className="mt-2 text-3xl font-bold">12</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Thống kê hoạt động</h3>
        <div className="h-[400px] w-full">
          <BarChart            width={800}
            height={400}
            data={data}
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
              isAnimationActive={false} // Disable animations to prevent hydration mismatches
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
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;