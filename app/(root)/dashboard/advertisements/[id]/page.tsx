"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

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

export default function AdvertisementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const response = await fetch(`/api/advertisements/${params.id}`);
        if (!response.ok) throw new Error('Không thể tải dữ liệu quảng cáo');
        const data = await response.json();
        setAdvertisement(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [params.id]);

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/advertisements/${params.id}/approve`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Không thể duyệt quảng cáo');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`/api/advertisements/${params.id}/reject`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Không thể từ chối quảng cáo');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!advertisement) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Không tìm thấy quảng cáo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chi tiết Quảng cáo</h2>
        <Button variant="outline" onClick={() => router.push('/dashboard/advertisements')}>
          Quay lại
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <Input value={advertisement.title} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <Input value={advertisement.description} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ảnh</label>
            <Image
              src={advertisement.imageUrl}
              alt={advertisement.title}
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL đích</label>
            <Input value={advertisement.targetUrl} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
            <Input value={new Date(advertisement.startDate).toLocaleDateString()} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
            <Input value={new Date(advertisement.endDate).toLocaleDateString()} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <Input value={advertisement.status} readOnly />
          </div>
          {advertisement.status === 'PENDING' && (
            <div className="flex gap-2">
              <Button onClick={handleApprove}>Duyệt</Button>
              <Button variant="destructive" onClick={handleReject}>Từ chối</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}