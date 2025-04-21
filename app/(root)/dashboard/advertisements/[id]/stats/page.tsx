"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdStats {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

interface Advertisement {
  id: string;
  title: string;
  stats: AdStats[];
}

export default function AdvertisementStatsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/advertisements/${params.id}/stats?range=${timeRange}`);
        if (!response.ok) throw new Error('Không thể tải dữ liệu thống kê');
        const data = await response.json();
        setAdvertisement(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [params.id, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error || !advertisement) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error || 'Không tìm thấy dữ liệu quảng cáo'}</p>
      </div>
    );
  }

  const totalImpressions = advertisement.stats.reduce((sum, stat) => sum + stat.impressions, 0);
  const totalClicks = advertisement.stats.reduce((sum, stat) => sum + stat.clicks, 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thống kê Quảng cáo: {advertisement.title}</h2>
        <Button variant="outline" onClick={() => router.push('/dashboard/advertisements')}>
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Tổng lượt hiển thị</h3>
          <p className="text-3xl font-bold">{totalImpressions.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Tổng lượt nhấp chuột</h3>
          <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Tỷ lệ nhấp chuột (CTR)</h3>
          <p className="text-3xl font-bold">{averageCTR.toFixed(2)}%</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Chi tiết theo thời gian</h3>
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeRange('week')}
            >
              Tuần
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeRange('month')}
            >
              Tháng
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'outline'}
              onClick={() => setTimeRange('year')}
            >
              Năm
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Ngày</th>
                <th className="pb-4 text-left font-medium">Lượt hiển thị</th>
                <th className="pb-4 text-left font-medium">Lượt nhấp chuột</th>
                <th className="pb-4 text-left font-medium">CTR</th>
              </tr>
            </thead>
            <tbody>
              {advertisement.stats.map((stat) => (
                <tr key={stat.date} className="border-b">
                  <td className="py-4">{new Date(stat.date).toLocaleDateString()}</td>
                  <td className="py-4">{stat.impressions.toLocaleString()}</td>
                  <td className="py-4">{stat.clicks.toLocaleString()}</td>
                  <td className="py-4">{stat.ctr.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}