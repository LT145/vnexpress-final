import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface StatsPopupProps {
  adId: string;
  onClose: () => void;
}

const StatsPopup = ({ adId, onClose }: StatsPopupProps) => {
  const [stats, setStats] = useState({
    impressions: 0,
    clicks: 0,
    ctr: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/advertisements/${adId}/stats`);
        if (!response.ok) throw new Error('Không thể tải dữ liệu thống kê');
        const data = await response.json();
        
        const impressions = data.impressions || 0;
        const clicks = data.clicks || 0;
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

        setStats({
          impressions,
          clicks,
          ctr,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        setStats({
          impressions: 0,
          clicks: 0,
          ctr: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [adId]);

  const chartData = [
    {
      name: 'Thống kê',
      impressions: stats.impressions,
      clicks: stats.clicks,
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="p-6 w-full max-w-4xl">
        <h3 className="text-lg font-medium mb-4 text-center">Thống kê Quảng cáo</h3>
        {loading ? (
          <p className="text-center">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="flex flex-col items-center">
            <BarChart
              width={700}
              height={300}
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="#8884d8" name="Lượt hiển thị" />
              <Bar dataKey="clicks" fill="#82ca9d" name="Lượt nhấp chuột" />
            </BarChart>
            <p className="mt-4">Tỷ lệ nhấp chuột (CTR): {stats.ctr.toFixed(2)}%</p>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </Card>
    </div>
  );
};

export { StatsPopup };