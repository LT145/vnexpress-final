"use client";

  import { useState, useEffect } from "react";
  import { Card } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";

  interface Comment {
    id: string;
    content: string;
    author: string;
    postTitle: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
    createdAt: string;
  }

  const CommentsPage = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [, setIsLoading] = useState(true);
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

    useEffect(() => {
      const fetchComments = async () => {
        try {
          const response = await fetch("/api/comments");
          if (!response.ok) throw new Error("Failed to fetch comments");
          const data = await response.json();
          console.log('API Response:', data); // Log the API response
          setComments(data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchComments();
    }, []);

    // Nhóm bình luận theo postTitle và sắp xếp theo comment cũ nhất
    const groupedComments: Record<string, Comment[]> = comments
      .reduce((acc, comment) => {
        if (!acc[comment.postTitle]) acc[comment.postTitle] = [];
        acc[comment.postTitle].push(comment);
        return acc;
      }, {} as Record<string, Comment[]>);
    
    // Create a deep copy of groupedComments before sorting
    const sortedGroupedComments = Object.fromEntries(
      Object.entries(groupedComments).map(([postTitle, comments]) => [
        postTitle,
        [...comments] // Create a new array for each group
      ])
    );
    
    // Sort comments within each group
    for (const postTitle in sortedGroupedComments) {
      sortedGroupedComments[postTitle].sort((a, b) => {
        // Approved and rejected comments go to the bottom
        if ((a.status === 'APPROVED' || a.status === 'REJECTED') && 
            (b.status !== 'APPROVED' && b.status !== 'REJECTED')) return 1;
        if ((b.status === 'APPROVED' || b.status === 'REJECTED') && 
            (a.status !== 'APPROVED' && a.status !== 'REJECTED')) return -1;
        
        // Sort by date for non-approved and non-rejected comments
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    }

    // Sắp xếp các bài viết theo comment cũ nhất
    const sortedPosts = Object.entries(sortedGroupedComments).sort(([, aComments], [, bComments]) => {
      const aOldest = aComments.reduce((oldest, current) => 
        oldest.createdAt < current.createdAt ? oldest : current
      );
      const bOldest = bComments.reduce((oldest, current) => 
        oldest.createdAt < current.createdAt ? oldest : current
      );
      return new Date(aOldest.createdAt).getTime() - new Date(bOldest.createdAt).getTime();
    });
    
    const togglePost = (postTitle: string) => {
      setExpandedPosts((prev) => ({
        ...prev,
        [postTitle]: !prev[postTitle],
      }));
    };

    const handleUpdateStatus = async (commentId: string, status: 'APPROVED' | 'REJECTED') => {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
    
        const result = await response.json();
        
        if (!response.ok) {
          console.error('API Error:', result);
          throw new Error(result.error || 'Failed to update comment');
        }

        const updatedComment = result;
        setComments(prev => prev.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        ));
      } catch (error) {
        console.error('Error updating comment:', error);
        alert(error instanceof Error ? error.message : 'Failed to update comment');
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Quản lý bình luận</h2>

        <Card className="p-6 space-y-4">

          {sortedPosts.map(([postTitle, comments]) => (
            <div key={postTitle} className="mt-2 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b rounded-t-lg">
                <h3 className="font-medium">{postTitle}</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => togglePost(postTitle)}
                >
                  {expandedPosts[postTitle] ? 'Ẩn bình luận' : 'Xem bình luận'}
                </Button>
              </div>
              
              {expandedPosts[postTitle] && (
                <div className="p-4 space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{comment.author}</p>
                          <p className="text-sm text-gray-600">{comment.content}</p>
                        </div>
                        <div className="flex gap-2">
                          {comment.status !== 'REJECTED' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateStatus(comment.id, 'APPROVED')}
                              disabled={comment.status === 'APPROVED'}
                            >
                              {comment.status === 'APPROVED' ? 'Đã duyệt' : 'Duyệt'}
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleUpdateStatus(comment.id, 'REJECTED')}
                            disabled={comment.status === 'REJECTED'}
                          >
                            {comment.status === 'REJECTED' ? 'Đã từ chối' : 'Từ chối'}
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
  {(() => {
    console.log('Raw createdAt:', comment.createdAt);
    return new Date(comment.createdAt).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  })()}
</div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>
    );
  };

  export default CommentsPage;
