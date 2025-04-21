"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateAdvertisementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    targetUrl: "",
    startDate: "",
    endDate: "",
    position: "",
    status: "pending", // Add status field for moderation
    placementType: "", // Add placement type field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        targetUrl: formData.targetUrl,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        placementType: formData.placementType // Ensure this is included
      };

      console.log('Sending request with data:', requestData);
      
      const response = await fetch("/api/advertisements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API Response Error:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        });
        throw new Error(
          responseData.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      router.push("/dashboard/advertisements");
    } catch (err) {
      console.error('API Error Details:', {
        error: err,
        timestamp: new Date().toISOString()
      });
      setError(
        err instanceof Error ? 
        `Lỗi khi tạo quảng cáo: ${err.message}` : 
        "Lỗi không xác định khi tạo quảng cáo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tạo Quảng cáo Mới</h2>
        <Button variant="outline" onClick={() => router.push("/dashboard/advertisements")}>
          Quay lại
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề quảng cáo</Label>
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
              required
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Hình ảnh</Label>
            <Input
              id="imageUrl"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("image", file);

                  try {
                    const response = await fetch(`https://api.imgbb.com/1/upload?key=d56688ff153b4c9dcb972fab16a5aadd`, {
                      method: "POST",
                      body: formData,
                    });

                    if (!response.ok) throw new Error("Tải ảnh thất bại");

                    const data = await response.json();
                    setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    setError("Không thể tải ảnh lên");
                  }
                }
              }}
              required
            />
          </div>

          <div>
            <Label htmlFor="targetUrl">Liên kết đích</Label>
            <Input
              id="targetUrl"
              type="url"
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="placementType">Loại vị trí</Label>
            <Select
              value={formData.placementType}
              onValueChange={(value) => setFormData({ ...formData, placementType: value })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại vị trí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner">Banner chính</SelectItem>
                <SelectItem value="in-content">Trong nội dung</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="position">Vị trí cụ thể</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn vị trí cụ thể" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homepage-top">Trang chủ - Đầu trang</SelectItem>
                <SelectItem value="article-top">Bài viết - Đầu trang</SelectItem>
                <SelectItem value="article-middle">Bài viết - Giữa nội dung</SelectItem>
                <SelectItem value="footer-center">Footer - Trung tâm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/advertisements")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo quảng cáo"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}