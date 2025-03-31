"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@prisma/client";

const mockUsers = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "USER",
    createdAt: "2024-03-29",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "EDITOR",
    createdAt: "2024-03-28",
  },
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <Button>Thêm người dùng</Button>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value={UserRole.USER}>Người dùng</SelectItem>
              <SelectItem value={UserRole.EDITOR}>Biên tập viên</SelectItem>
              <SelectItem value={UserRole.MODERATOR}>Kiểm duyệt viên</SelectItem>
              <SelectItem value={UserRole.ADVERTISER}>Nhà quảng cáo</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Quản trị viên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Tên</th>
                <th className="pb-4 text-left font-medium">Email</th>
                <th className="pb-4 text-left font-medium">Vai trò</th>
                <th className="pb-4 text-left font-medium">Ngày tạo</th>
                <th className="pb-4 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-4">{user.name}</td>
                  <td className="py-4">{user.email}</td>
                  <td className="py-4">{user.role}</td>
                  <td className="py-4">{user.createdAt}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Chỉnh sửa
                      </Button>
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

export default UsersPage;