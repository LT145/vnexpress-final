'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} năm trước`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} tháng trước`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} ngày trước`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} giờ trước`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} phút trước`;
  
  return 'Vừa xong';
};
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

interface Comment {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}
interface CommentProps {
  postId: number;
  userId?: string;
}

export default function Comment({ postId, userId }: CommentProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [commentToReport, setCommentToReport] = useState<string | null>(null);

  const handleReport = async () => {
    try {
      if (!commentToReport) return;
      
      const response = await fetch("/api/postdetail/report-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: commentToReport,
          userId: session?.user?.id,
          reason: reportReason,
          notes: reportNotes,
        }),
      });

      if (!response.ok) throw new Error("Báo cáo thất bại");

      setShowReportDialog(false);
      setReportReason('');
      setReportNotes('');
      toast.success("Đã báo cáo bình luận");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi báo cáo bình luận");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/postdetail/comments?postId=${postId}&status=APPROVED`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !session?.user?.id) return;
    try {
      setLoading(true);
      const response = await fetch('/api/postdetail/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: newComment,
          userId: session.user.id
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const data = await response.json();
      setComments([...comments, data]);
      setNewComment('');
      toast.success('Bình luận đã được gửi thành công!');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/postdetail/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(comments.filter(comment => comment.id !== commentId));
      setCommentToDelete(null); // Close the dialog
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-xl font-semibold">Bình luận ({comments.filter(comment => comment.status === 'APPROVED').length})</h3>
      {session && (
        <div className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
          />
          <Button onClick={handleSubmit} disabled={loading}>
            Gửi
          </Button>
        </div>
      )}
      <div className="space-y-4">
        {comments.filter(comment => comment.status === 'APPROVED').map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {comment.author.avatar ? (
                <Image
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  width={32}
                  height={32}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm">{comment.author.name[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium">{comment.author.name}</div>
              <div className="text-sm text-gray-600">{comment.content}</div>
              <div className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()} • {formatTimeAgo(comment.createdAt)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <i 
                  className="fas fa-flag text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => {
                    setCommentToReport(comment.id);
                    setShowReportDialog(true);
                  }}
                ></i>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Báo cáo
                </div>
              </div>
              {comment.author.id === userId && (
                <Trash2
                  className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => setCommentToDelete(comment.id)}
                />
              )}
            </div>
          </div>
        ))}

        {/* Add the confirmation dialog */}
        <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa bình luận này?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Bình luận sẽ bị xóa vĩnh viễn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => commentToDelete && handleDeleteComment(commentToDelete)}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
    {/* Report Dialog */}
    <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Báo cáo bình luận</AlertDialogTitle>
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
    <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}