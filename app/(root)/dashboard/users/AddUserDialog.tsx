"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AddUserDialogProps {
  onSuccess: () => void;
}

export function AddUserDialog({ onSuccess }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Thêm người dùng</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger>
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.USER}>Người dùng</SelectItem>
              <SelectItem value={UserRole.EDITOR}>Biên tập viên</SelectItem>
              <SelectItem value={UserRole.MODERATOR}>Kiểm duyệt viên</SelectItem>
              <SelectItem value={UserRole.ADVERTISER}>Nhà quảng cáo</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Quản trị viên</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Lưu'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}