"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockAds = [
  {
    id: "1",
    title: "Quảng cáo 1",
    advertiser: "Công ty A",
    status: "ACTIVE",
    startDate: "2024-03-29",
    endDate: "2024-04-29",
    impressions: 1234,
    clicks: 56,
  },
  {
    id: "2",
    title: "Quảng cáo 2",
    advertiser: "Công ty B",
    status: "PENDING",
    startDate: "2024-04-01",
    endDate: "2024-05-01",
    impressions: 0,
    clicks: 0,
  },
];

const AdsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý quảng cáo</h2>
        <Button>Thêm quảng cáo</Button>
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
              <SelectItem value="ACTIVE">Đang chạy</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="PAUSED">Tạm dừng</SelectItem>
              <SelectItem value="ENDED">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Tiêu đề</th>
                <th className="pb-4 text-left font-medium">Nhà quảng cáo</th>
                <th className="pb-4 text-left font-medium">Trạng thái</th>
                <th className="pb-4 text-left font-medium">Thời gian</th>
                <th className="pb-4 text-left font-medium">Hiệu suất</th>
                <th className="pb-4 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockAds.map((ad) => (
                <tr key={ad.id} className="border-b">
                  <td className="py-4">{ad.title}</td>
                  <td className="py-4">{ad.advertiser}</td>
                  <td className="py-4">
                    {ad.status === "ACTIVE" ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Đang chạy
                      </span>
                    ) : ad.status === "PENDING" ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Chờ duyệt
                      </span>
                    ) : ad.status === "PAUSED" ? (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        Tạm dừng
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Đã kết thúc
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    {ad.startDate} - {ad.endDate}
                  </td>
                  <td className="py-4">
                    <div className="text-sm">
                      <p>Lượt hiển thị: {ad.impressions}</p>
                      <p>Lượt nhấp: {ad.clicks}</p>
                      <p>CTR: {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                      {ad.status === "PENDING" && (
                        <Button variant="default" size="sm">
                          Phê duyệt
                        </Button>
                      )}
                      {ad.status === "ACTIVE" && (
                        <Button variant="outline" size="sm">
                          Tạm dừng
                        </Button>
                      )}
                      {ad.status === "PAUSED" && (
                        <Button variant="outline" size="sm">
                          Tiếp tục
                        </Button>
                      )}
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

export default AdsPage;