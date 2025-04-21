"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from 'next/image';

interface Report {
  id: string;
  reason: string;
  reporter: { name: string };
  type: 'POST' | 'COMMENT';
  post?: { 
    title: string;
    content: string;
    imageUrls: string[];
  };
  comment?: { content: string };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  notes?: string;
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<Report | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch report');
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to load report');
      }
    };

    fetchReport();
  }, [params.id]);

  const handleUpdateStatus = async (status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/reports/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          // Only include hideContent when status is ACCEPTED
          ...(status === 'ACCEPTED' && { hideContent: true })
        }),
      });

      if (!response.ok) throw new Error('Failed to update report status');

      toast.success(`Report ${status === 'ACCEPTED' ? 'accepted' : 'rejected'}`);
      router.push('/dashboard/reports');
    } catch (error) {
      console.error('Error updating report status:', error);
      toast.error('Failed to update report status');
    }
  };

  if (!report) {
    return <div className="text-center py-8">Loading report...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/dashboard/reports">Quay lại</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Lý do:</h4>
          <p>{report.reason}</p>
        </div>
        <div>
          <h4 className="font-medium">Người báo cáo:</h4>
          <p>{report.reporter.name}</p>
        </div>
        <div>
          <h4 className="font-medium">Đối tượng:</h4>
          <p>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
              {report.type === 'POST' ? 'Bài viết' : 'Bình luận'}
            </span>
            <p className="mt-1">
              {report.type === 'POST' ? report.post?.title : report.comment?.content}
            </p>
          </p>
        </div>
        <div>
          <h4 className="font-medium">Ghi chú:</h4>
          <p>{report.notes || 'Không có ghi chú'}</p>
        </div>
        <div>
          <h4 className="font-medium">Ngày tạo:</h4>
          <p>{report.createdAt}</p>
        </div>
      </div>

      {report.type === 'POST' && report.post && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{report.post.title}</h2>
          <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: report.post.content }} />
          {(report.post.imageUrls || []).length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {(report.post.imageUrls || []).map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Post image ${index + 1}`}
                  width={400}
                  height={192}
                  className="rounded-lg object-cover w-full h-48"
                  priority
                />
              ))}
            </div>
          )}
        </div>
      )}

      {report.type === 'COMMENT' && report.comment && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Bình luận</h3>
          <p className="text-gray-700">{report.comment.content}</p>
        </div>
      )}
      {report.status === "PENDING" && (
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={() => handleUpdateStatus('ACCEPTED')}
          >
            Chấp nhận
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleUpdateStatus('REJECTED')}
          >
            Từ chối
          </Button>
        </div>
      )}
    </div>
  );
}