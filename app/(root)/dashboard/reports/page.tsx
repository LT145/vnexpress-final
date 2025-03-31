"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockReports = [
  {
    id: "1",
    reason: "Nội dung không phù hợp",
    reporter: "Nguyễn Văn A",
    targetType: "POST",
    targetTitle: "Tiêu đề bài viết 1",
    status: "PENDING",
    createdAt: "2024-03-29",
  },
  {
    id: "2",
    reason: "Spam",
    reporter: "Trần Thị B",
    targetType: "COMMENT",
    targetTitle: "Bình luận về bài viết 2",
    status: "ACCEPTED",
    createdAt: "2024-03-28",
  },
];

const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý báo cáo</h2>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm báo cáo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ xử lý</SelectItem>
              <SelectItem value="ACCEPTED">Đã chấp nhận</SelectItem>
              <SelectItem value="REJECTED">Đã từ chối</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loại báo cáo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="POST">Bài viết</SelectItem>
              <SelectItem value="COMMENT">Bình luận</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Lý do</th>
                <th className="pb-4 text-left font-medium">Người báo cáo</th>
                <th className="pb-4 text-left font-medium">Đối tượng</th>
                <th className="pb-4 text-left font-medium">Trạng thái</th>
                <th className="pb-4 text-left font-medium">Ngày tạo</th>
                <th className="pb-4 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((report) => (
                <tr key={report.id} className="border-b">
                  <td className="py-4">{report.reason}</td>
                  <td className="py-4">{report.reporter}</td>
                  <td className="py-4">
                    <div>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        {report.targetType}
                      </span>
                      <p className="mt-1">{report.targetTitle}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    {report.status === "PENDING" ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Chờ xử lý
                      </span>
                    ) : report.status === "ACCEPTED" ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Đã chấp nhận
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Đã từ chối
                      </span>
                    )}
                  </td>
                  <td className="py-4">{report.createdAt}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                      {report.status === "PENDING" && (
                        <>
                          <Button variant="default" size="sm">
                            Chấp nhận
                          </Button>
                          <Button variant="destructive" size="sm">
                            Từ chối
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;