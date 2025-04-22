"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddUserDialog } from "./AddUserDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@prisma/client";


interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const url = `/api/users?${new URLSearchParams({
        search: searchTerm,
        role: selectedRole === 'all' ? '' : selectedRole
      })}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.map((user: any) => ({
        ...user,
        role: user.role as UserRole,
        createdAt: user.createdAt
      })));
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, searchTerm, selectedRole]);

  

  if (loading) {
    return <div className="py-8 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <AddUserDialog onSuccess={() => fetchUsers()} />
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select defaultValue="all" onValueChange={(value: UserRole | 'all') => setSelectedRole(value)}>
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
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-4">{user.name}</td>
                  <td className="py-4">{user.email}</td>
                  <td className="py-4">
                    {editingUserId === user.id ? (
                      <Select
                        value={user.role}
                        onValueChange={(value) => {
                          setUsers(users.map(u => u.id === user.id ? { ...u, role: value as UserRole } : u));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={user.role} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRole.USER}>Người dùng</SelectItem>
                          <SelectItem value={UserRole.EDITOR}>Biên tập viên</SelectItem>
                          <SelectItem value={UserRole.MODERATOR}>Kiểm duyệt viên</SelectItem>
                          <SelectItem value={UserRole.ADVERTISER}>Nhà quảng cáo</SelectItem>
                          <SelectItem value={UserRole.ADMIN}>Quản trị viên</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="py-2">
                        {user.role === UserRole.USER && "Người dùng"}
                        {user.role === UserRole.EDITOR && "Biên tập viên"}
                        {user.role === UserRole.MODERATOR && "Kiểm duyệt viên"}
                        {user.role === UserRole.ADVERTISER && "Nhà quảng cáo"}
                        {user.role === UserRole.ADMIN && "Quản trị viên"}
                      </div>
                    )}
                </td>
                  <td className="py-4">{user.createdAt}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {editingUserId === user.id ? (
                        <Button variant="default" size="sm" onClick={async () => {
                          try {
                            const response = await fetch(`/api/users/${user.id}`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ role: user.role }),
                            });
                            if (!response.ok) throw new Error('Failed to update role');
                            setUsers(users.map(u => u.id === user.id ? { ...u, role: user.role } : u));
                            setEditingUserId(null);
                          } catch (err) {
                            console.error('Error updating role:', err);
                          }
                        }}>
                          Lưu
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => setEditingUserId(user.id)}>
                          Chỉnh sửa
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={async () => {
                          try {
                            const response = await fetch(`/api/users/${user.id}`, {
                              method: 'DELETE'
                            });
                            if (!response.ok) {
                              throw new Error('Failed to delete user');
                            }
                            setUsers(users.filter(u => u.id !== user.id));
                          } catch (err) {
                            console.error('Error deleting user:', err);
                          }
                        }}>
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