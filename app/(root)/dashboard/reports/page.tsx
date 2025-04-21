"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface Report {
  id: string;
  reason: string;
  reporter: { name: string };
  type: 'POST' | 'COMMENT';
  post?: { title: string };
  comment?: { content: string };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  notes?: string; // Add this line
}

const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdateStatus = async (reportId: string, status: 'ACCEPTED' | 'REJECTED') => {
  //   try {
  //     const response = await fetch(`/api/reports/${reportId}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ status }),
  //     });

  //     if (!response.ok) throw new Error('Failed to update report status');

  //     setReports(prev => prev.map(report => 
  //       report.id === reportId ? { ...report, status } : report
  //     ));
  //     toast.success(`Report ${status === 'ACCEPTED' ? 'accepted' : 'rejected'}`);
  //   } catch (error) {
  //     console.error('Error updating report status:', error);
  //     toast.error('Failed to update report status');
  //   }
  // };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  // const handleViewDetails = (report: Report) => {
  //   setSelectedReport(report);
  // };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Quản lý báo cáo</h2>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <Input
              placeholder="Tìm kiếm báo cáo..."
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
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="ACCEPTED">Đã chấp nhận</SelectItem>
                <SelectItem value="REJECTED">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="POST">Bài viết</SelectItem>
                <SelectItem value="COMMENT">Bình luận</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-4 text-left font-medium">Lý do</th>
                  <th className="pb-4 text-left font-medium">Người báo cáo</th>
                  <th className="pb-4 text-left font-medium">Đối tượng</th>
                  <th className="pb-4 text-left font-medium">Trạng thái</th>
                  <th className="pb-4 text-left font-medium">Ghi chú</th>
                  <th className="pb-4 text-left font-medium">Ngày tạo</th>
                  <th className="pb-4 text-left font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b">
                    <td className="py-4">
                      {report.reason === 'spam' ? 'Spam' : 
                       report.reason === 'inappropriate' ? 'Nội dung không phù hợp' : 
                       report.reason === 'misinformation' ? 'Thông tin sai lệch' : 
                       report.reason === 'other' ? 'Lý do khác' : 
                       report.reason}
                    </td>
                    <td className="py-4">{report.reporter.name}</td>
                    <td className="py-4">
                      <div>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                          {report.type === 'POST' ? 'Bài viết' : 'Bình luận'}
                        </span>
                        <p className="mt-1">
                          {report.type === 'POST' ? report.post?.title : report.comment?.content}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      {report.status === "PENDING" ? (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Chờ xử lý
                        </span>
                      ) : report.status === "ACCEPTED" ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Đã chấp nhận
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          Đã từ chối
                        </span>
                      )}
                    </td>
                    <td className="py-4">{report.notes || 'Không có ghi chú'}</td>
                    <td className="py-4">{report.createdAt}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          asChild variant="outline" size="sm">
                          <Link href={`/dashboard/reports/${report.id}`}>Chi tiết</Link>
                          </Button>
                        {report.status === "PENDING" && (
                          <>

                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Add the details dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết báo cáo</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Lý do:</h4>
                <p>{selectedReport.reason}</p>
              </div>
              <div>
                <h4 className="font-medium">Người báo cáo:</h4>
                <p>{selectedReport.reporter.name}</p>
              </div>
              <div>
                <h4 className="font-medium">Đối tượng:</h4>
                <p>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                    {selectedReport.type === 'POST' ? 'Bài viết' : 'Bình luận'}
                  </span>
                  <p className="mt-1">
                    {selectedReport.type === 'POST' 
                      ? selectedReport.post?.title 
                      : selectedReport.comment?.content}
                  </p>
                </p>
              </div>
              <div>
                <h4 className="font-medium">Ghi chú:</h4>
                <p>{selectedReport.notes || 'Không có ghi chú'}</p>
              </div>
              <div>
                <h4 className="font-medium">Ngày tạo:</h4>
                <p>{selectedReport.createdAt}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
);
};

export default ReportsPage;