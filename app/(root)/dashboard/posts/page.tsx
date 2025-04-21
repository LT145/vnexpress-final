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
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
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
                        <Button variant="destructive" size="sm">
                          Xóa
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