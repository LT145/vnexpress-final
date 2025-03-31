"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockPosts = [
  {
    id: "1",
    title: "Tiêu đề bài viết 1",
    author: "Nguyễn Văn A",
    published: true,
    createdAt: "2024-03-29",
  },
  {
    id: "2",
    title: "Tiêu đề bài viết 2",
    author: "Trần Thị B",
    published: false,
    createdAt: "2024-03-28",
  },
];

const PostsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý bài viết</h2>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm bài viết..."
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
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Tiêu đề</th>
                <th className="pb-4 text-left font-medium">Tác giả</th>
                <th className="pb-4 text-left font-medium">Trạng thái</th>
                <th className="pb-4 text-left font-medium">Ngày tạo</th>
                <th className="pb-4 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockPosts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="py-4">{post.title}</td>
                  <td className="py-4">{post.author}</td>
                  <td className="py-4">
                    {post.published ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Chờ duyệt
                      </span>
                    )}
                  </td>
                  <td className="py-4">{post.createdAt}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Xem
                      </Button>
                      <Button variant="outline" size="sm">
                        Chỉnh sửa
                      </Button>
                      {!post.published && (
                        <Button variant="default" size="sm">
                          Phê duyệt
                        </Button>
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

export default PostsPage;