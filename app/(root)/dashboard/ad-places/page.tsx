"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdPlace {
  id: string;
  name: string;
  description: string;
  position: string;
  maxAds: number;
}

export default function AdPlacesPage() {
  const router = useRouter();
  const [adPlaces, setAdPlaces] = useState<AdPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    position: "",
    maxAds: 1,
  });

  useEffect(() => {
    const fetchAdPlaces = async () => {
      try {
        const response = await fetch('/api/ad-places');
        if (!response.ok) throw new Error('Không thể tải dữ liệu vị trí quảng cáo');
        const data = await response.json();
        setAdPlaces(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchAdPlaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ad-places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Không thể tạo vị trí quảng cáo');

      const newAdPlace = await response.json();
      setAdPlaces([...adPlaces, newAdPlace]);
      setShowForm(false);
      setFormData({
        name: "",
        description: "",
        position: "",
        maxAds: 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý Vị trí Quảng cáo</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hủy' : 'Thêm vị trí mới'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Tên vị trí</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên vị trí quảng cáo"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả vị trí"
              />
            </div>

            <div>
              <Label htmlFor="position">Vị trí hiển thị</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Ví dụ: banner, sidebar, footer"
                required
              />
            </div>

            <div>
              <Label htmlFor="maxAds">Số lượng quảng cáo tối đa</Label>
              <Input
                id="maxAds"
                type="number"
                min="1"
                value={formData.maxAds}
                onChange={(e) => setFormData({ ...formData, maxAds: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Hủy
              </Button>
              <Button type="submit">Tạo vị trí</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Tên vị trí</th>
                <th className="pb-4 text-left font-medium">Vị trí hiển thị</th>
                <th className="pb-4 text-left font-medium">Số lượng tối đa</th>
                <th className="pb-4 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : adPlaces.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    Chưa có vị trí quảng cáo nào
                  </td>
                </tr>
              ) : (
                adPlaces.map((place) => (
                  <tr key={place.id} className="border-b">
                    <td className="py-4">{place.name}</td>
                    <td className="py-4">{place.position}</td>
                    <td className="py-4">{place.maxAds}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/ad-places/${place.id}`)}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (confirm('Bạn có chắc chắn muốn xóa vị trí này?')) {
                              try {
                                const response = await fetch(`/api/ad-places/${place.id}`, {
                                  method: 'DELETE',
                                });
                                if (!response.ok) throw new Error('Không thể xóa vị trí');
                                setAdPlaces(adPlaces.filter((p) => p.id !== place.id));
                              } catch (error) {
                                console.error('Error:', error);
                                setError('Không thể xóa vị trí quảng cáo');
                              }
                            }
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}