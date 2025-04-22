"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';
  createdAt: string;
}

export default function AdvertisementsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await fetch('/api/advertisements?sort=createdAt:desc');
        if (!response.ok) throw new Error('Không thể tải dữ liệu quảng cáo');
        const data = await response.json();
        setAdvertisements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ENDED':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý Quảng cáo</h2>
        <Button onClick={() => router.push('/dashboard/advertisements/create')}>
          Tạo Quảng cáo Mới
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm quảng cáo..."
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
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="paused">Tạm dừng</SelectItem>
              <SelectItem value="ended">Đã kết thúc</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="top">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vị trí" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Đầu trang</SelectItem>
              <SelectItem value="middle">Giữa trang</SelectItem>
              <SelectItem value="bottom">Cuối trang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Tiêu đề</th>
                <th className="pb-4 text-left font-medium">Ngày tạo</th>
                <th className="pb-4 text-left font-medium">Trạng thái</th>

                <th className="pb-4 text-left font-medium">Thống kê</th>
                <th className="pb-4 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : advertisements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    Chưa có quảng cáo nào
                  </td>
                </tr>
              ) : (
                advertisements.map((ad) => (
                  <tr key={ad.id} className="border-b">
                    <td className="py-4">{ad.title}</td>
                    <td className="py-4">{new Date(ad.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ad.status)}`}>
                        {ad.status === 'ACTIVE' ? 'Đang hoạt động'
                          : ad.status === 'PAUSED' ? 'Tạm dừng'
                          : ad.status === 'ENDED' ? 'Đã kết thúc'
                          : 'Chờ duyệt'}
                      </span>
                    </td>

                    <td className="py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/advertisements/${ad.id}/stats`)}
                      >
                        Xem thống kê
                      </Button>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/advertisements/${ad.id}`)}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (ad.status === 'ACTIVE') {
                              try {
                                const response = await fetch(`/api/advertisements/${ad.id}`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ status: 'PAUSED' }),
                                });
                                if (!response.ok) throw new Error('Không thể tạm dừng quảng cáo');
                                // Update state
                                setAdvertisements((prev) => prev.map((a) => a.id === ad.id ? { ...a, status: ad.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : a));
                              } catch (error) {
                                console.error('Error:', error);
                              }
                            } else if (ad.status === 'PAUSED') {
                              try {
                                const response = await fetch(`/api/advertisements/${ad.id}`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ status: 'ACTIVE' }),
                                });
                                if (!response.ok) throw new Error('Không thể kích hoạt quảng cáo');
                                // Update state
                                setAdvertisements((prev) => prev.map((a) => a.id === ad.id ? { ...a, status: ad.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : a));
                              } catch (error) {
                                console.error('Error:', error);
                              }
                            }
                          }}
                        >
                          {ad.status === 'ACTIVE' ? 'Tạm dừng' : ad.status === 'PAUSED' ? 'Kích hoạt' : ad.status === 'ENDED' ? 'Đã kết thúc' : 'Chờ duyệt'}
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