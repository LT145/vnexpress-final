"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Flag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Comment from "@/components/Post/Comment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string;
  publishedAt: Date;
  imageUrls: string[];
  status: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    profile: {
      gender: string;
      phone: string;
      address: string;
      birthDate: Date;
    } | null;
  };
}

// Hàm fetch dùng cho SWR
export default function PostDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const postId = useMemo(() => params?.id, [params]);

  const [post, setPost] = useState<Post | null>(null);
  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Add these state declarations
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportNotes, setReportNotes] = useState('');

  // Add the handleReport function
  const handleReport = async () => {
    try {
      const response = await fetch("/api/postdetail/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post?.id,
          userId: session?.user?.id,
          reason: reportReason,
          notes: reportNotes,
        }),
      });

      if (!response.ok) throw new Error("Báo cáo thất bại");

      setShowReportDialog(false);
      setReportReason('');
      setReportNotes('');
      toast.success("Đã báo cáo bài viết");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi báo cáo bài viết");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const response = await fetch(`/api/postdetail?id=${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSavedStatus = async () => {
      if (!postId || !session?.user?.id) return;
      try {
        const response = await fetch(
          `/api/postdetail/check-saved?postId=${postId}&userId=${session.user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch saved status");
        const data = await response.json();
        setIsSaved(data.isSaved); // fix ở đây
      } catch (err) {
        console.error("Error fetching saved status:", err);
      }
    };

    fetchPost();
    fetchSavedStatus();
  }, [postId, session?.user?.id]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 space-y-4">
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-80 w-full" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Không tìm thấy bài viết
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <div className="text-sm text-muted-foreground mb-2 text-right">
            Ngày đăng bài: {new Date(post.publishedAt).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-lg max-w-none leading-7 text-justify [&>p]:mt-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Tác giả</h3>
            <div className="flex items-center gap-4">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    {post.author.name[0]}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">
                  {post.author.email}
                </div>
                {post.author.profile?.address && (
                  <div className="text-sm text-muted-foreground">
                    {post.author.profile.address}
                  </div>
                )}
              </div>
              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={async () => {
                    try {
                      const method = isSaved ? "DELETE" : "POST";
                      const response = await fetch("/api/postdetail/save", {
                        method,
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          postId: post.id,
                          userId: session?.user?.id,
                        }),
                      });

                      if (!response.ok) throw new Error("Lưu thất bại");

                      setIsSaved(!isSaved);
                      toast.success(isSaved ? "Đã xóa lưu bài viết" : "Đã lưu bài viết");
                    } catch (error) {
                      console.error(error);
                      toast.error("Có lỗi xảy ra khi lưu bài viết");
                    }
                  }}
                >
                  <Bookmark
                    className={`mr-2 h-4 w-4 ${isSaved ? "text-red-500" : ""}`}
                  />
                  {isSaved ? "Đã lưu" : "Lưu"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => setShowReportDialog(true)}
                >
                  <Flag className="mr-2 h-3 w-3" />
                  Báo cáo
                </Button>
                
                {/* Report Dialog */}
                <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Báo cáo bài viết</AlertDialogTitle>
                      <AlertDialogDescription>
                        Vui lòng chọn lý do báo cáo và thêm ghi chú (nếu có)
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Chọn lý do báo cáo</option>
                        <option value="spam">Spam</option>
                        <option value="inappropriate">Nội dung không phù hợp</option>
                        <option value="misinformation">Thông tin sai lệch</option>
                        <option value="other">Lý do khác</option>
                      </select>
                      <textarea
                        value={reportNotes}
                        onChange={(e) => setReportNotes(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Ghi chú thêm (nếu có)"
                        rows={3}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleReport}
                        disabled={!reportReason}
                      >
                        Gửi báo cáo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Comment 
        postId={post.id} 
        userId={session?.user?.id} // Add this line to pass current user ID
      />
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
    </div>
  );
}
