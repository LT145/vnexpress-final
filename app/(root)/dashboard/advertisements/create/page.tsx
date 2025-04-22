"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvertisementForm {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: string;
  displayPlace: string;
}

export default function CreateAdvertisementPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdvertisementForm>({
    title: "",
    description: "",
    imageUrl: "",
    targetUrl: "",
      position: "top",
  displayPlace: "home",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/advertisements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Không thể tạo quảng cáo');

      router.push('/dashboard/advertisements');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tạo Quảng cáo Mới</h2>
        <Button variant="outline" onClick={() => router.push('/dashboard/advertisements')}>
          Quay lại
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề quảng cáo"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả quảng cáo"
            />
          </div>

          <div>
            <Label htmlFor="image">Hình ảnh</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const uploadData = new FormData();
                  uploadData.append('image', file);
                  const response = await fetch('https://api.imgbb.com/1/upload?key=d56688ff153b4c9dcb972fab16a5aadd', {
                    method: 'POST',
                    body: uploadData
                  });
                  const result = await response.json();
                  setFormData((prev) => ({ ...prev, imageUrl: result.data.url }));
                }
              }}
              required
            />
          </div>    

          <div>
            <Label htmlFor="targetUrl">URL đích</Label>
            <Input
              id="targetUrl"
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              placeholder="Nhập URL đích"
              required
            />
          </div>

          <div>
            <Label>Nơi hiển thị</Label>
            <Select
              value={formData.displayPlace}
              onValueChange={(value) => setFormData({ ...formData, displayPlace: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nơi hiển thị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Trang chủ</SelectItem>
                <SelectItem value="post">Bài viết</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Vị trí hiển thị</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vị trí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Đầu trang</SelectItem>
                <SelectItem value="left">Bên trái</SelectItem>
                <SelectItem value="right">Bên phải</SelectItem>
                <SelectItem value="bottom">Cuối trang</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="grid grid-cols-2 gap-4">

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
</div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo quảng cáo'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}