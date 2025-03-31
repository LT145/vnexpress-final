"use client";

import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const userActivityData = [
  { name: "T1", newUsers: 400, activeUsers: 800 },
  { name: "T2", newUsers: 300, activeUsers: 1000 },
  { name: "T3", newUsers: 200, activeUsers: 1200 },
  { name: "T4", newUsers: 278, activeUsers: 1400 },
  { name: "T5", newUsers: 189, activeUsers: 1600 },
];

const contentStats = [
  { name: "T1", posts: 240, comments: 670 },
  { name: "T2", posts: 139, comments: 450 },
  { name: "T3", posts: 980, comments: 1200 },
  { name: "T4", posts: 390, comments: 800 },
  { name: "T5", posts: 480, comments: 900 },
];

const adPerformanceData = [
  { name: "T1", impressions: 10000, clicks: 300, ctr: 3 },
  { name: "T2", impressions: 12000, clicks: 400, ctr: 3.33 },
  { name: "T3", impressions: 9000, clicks: 350, ctr: 3.89 },
  { name: "T4", impressions: 15000, clicks: 600, ctr: 4 },
  { name: "T5", impressions: 11000, clicks: 450, ctr: 4.09 },
];

const reportStats = [
  { name: "Nội dung không phù hợp", value: 40 },
  { name: "Spam", value: 30 },
  { name: "Quấy rối", value: 20 },
  { name: "Vi phạm bản quyền", value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatisticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thống kê chi tiết</h2>
        <Select defaultValue="month">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Tuần này</SelectItem>
            <SelectItem value="month">Tháng này</SelectItem>
            <SelectItem value="year">Năm nay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hoạt động người dùng */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Hoạt động người dùng</h3>
          <LineChart
            width={500}
            height={300}
            data={userActivityData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newUsers" stroke="#8884d8" name="Người dùng mới" />
            <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" name="Người dùng hoạt động" />
          </LineChart>
        </Card>

        {/* Thống kê nội dung */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Thống kê nội dung</h3>
          <BarChart
            width={500}
            height={300}
            data={contentStats}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="posts" fill="#8884d8" name="Bài viết" />
            <Bar dataKey="comments" fill="#82ca9d" name="Bình luận" />
          </BarChart>
        </Card>

        {/* Hiệu suất quảng cáo */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Hiệu suất quảng cáo</h3>
          <LineChart
            width={500}
            height={300}
            data={adPerformanceData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" name="Lượt hiển thị" />
            <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#82ca9d" name="Lượt nhấp" />
            <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#ffc658" name="CTR (%)" />
          </LineChart>
        </Card>

        {/* Thống kê báo cáo */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Phân loại báo cáo</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={reportStats}
              cx={250}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {reportStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPage;