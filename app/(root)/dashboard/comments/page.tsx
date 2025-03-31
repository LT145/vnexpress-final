"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockComments = [
  {
    id: "1",
    content: "Bình luận 1",
    author: "Nguyễn Văn A",
    postTitle: "Tiêu đề bài viết 1",
    createdAt: "2024-03-29",
    status: "APPROVED",
  },
  {
    id: "2",
    content: "Bình luận 2",
    author: "Trần Thị B",
    postTitle: "Tiêu đề bài viết 2",
    createdAt: "2024-03-28",
    status: "PENDING",
  },
];

const CommentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý bình luận</h2>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm bình luận..."
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
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="REJECTED">Đã từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Nội dung</th>
                <th className="pb-4 text-left font-medium">Tác giả</th>
                <th className="pb-4 text-left font-medium">Bài viết</th>
                <th className="pb-4 text-left font-medium">Trạng thái</th>
                <th className="pb-4 text-left font-medium">Ngày tạo</th>
                <th className="pb-4 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockComments.map((comment) => (
                <tr key={comment.id} className="border-b">
                  <td className="py-4 max-w-md truncate">{comment.content}</td>
                  <td className="py-4">{comment.author}</td>
                  <td className="py-4">{comment.postTitle}</td>
                  <td className="py-4">
                    {comment.status === "APPROVED" ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Đã duyệt
                      </span>
                    ) : comment.status === "PENDING" ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Chờ duyệt
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Đã từ chối
                      </span>
                    )}
                  </td>
                  <td className="py-4">{comment.createdAt}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {comment.status === "PENDING" && (
                        <>
                          <Button variant="default" size="sm">
                            Duyệt
                          </Button>
                          <Button variant="destructive" size="sm">
                            Từ chối
                          </Button>
                        </>
                      )}
                      <Button variant="destructive" size="sm">
                        Xóa
                      </Button>
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

export default CommentsPage;