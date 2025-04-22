"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PostsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'PUBLISHED' | 'DRAFT' | 'PENDING'>('all');
  interface Post {
  id: string;
  title: string;
  author?: { name: string };
  status: 'PUBLISHED' | 'DRAFT' | string;
  createdAt: string;
}

const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const filteredPosts = data.filter((post: Post) => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedStatus === 'all' || post.status === selectedStatus)
        );
        setPosts(filteredPosts);
        const sortedPosts = filteredPosts.sort((a: Post, b: Post) => {
          if (a.status === 'DRAFT' && b.status !== 'DRAFT') return -1;
          if (b.status === 'DRAFT' && a.status !== 'DRAFT') return 1;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        setPosts(sortedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, selectedStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý bài viết</h2>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select defaultValue="all" onValueChange={(value: 'all' | 'PUBLISHED' | 'DRAFT' | 'PENDING') => setSelectedStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="PUBLISHED">Đã Duyệt</SelectItem>
              <SelectItem value="PENDING">Chờ Duyệt</SelectItem>
              <SelectItem value="DELETED">Đã Từ Chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium w-[300px]">Tiêu đề</th>
                <th className="pb-4 text-left font-medium w-[150px]">Tác giả</th>
                <th className="pb-4 text-left font-medium w-[150px]">Trạng thái</th>
                <th className="pb-4 text-left font-medium w-[150px]">Ngày tạo</th>
                <th className="pb-4 text-left font-medium w-[200px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    Không có bài viết nào
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b">
                    <td className="py-4">{post.title}</td>
                    <td className="py-4">{post.author?.name || 'Không xác định'}</td>
                    <td className="py-4">
                        {post.status === 'PUBLISHED' ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Đã duyệt
                          </span>
                        ) : post.status === 'DRAFT' ? (
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            chờ duyệt
                          </span>
                        ) : post.status === 'DELETED' ? (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            Đã từ chối
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                            {post.status}
                          </span>
                        )}
                    </td>
                    <td className="py-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/posts/${post.id}`)}>
                          Xem và Chỉnh sửa
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
};

export default PostsPage;