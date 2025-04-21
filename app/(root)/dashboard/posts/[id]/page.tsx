"use client";

import React from "react";
import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import RichTextEditor from "@/components/RichTextEditor";

type Post = {
  id: number;
  title: string;
  content: string;
  author?: { name: string };
  status: 'PUBLISHED' | 'DRAFT' | string;
  createdAt: string;
};

export default function PostEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'DRAFT',
    categoryId: '',
    publishedAt: null as string | null
  });
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/postdetail/${params.id}`),
          fetch('/api/categories')
        ]);
        
        if (postResponse.status === 404) {
          setError('Không tìm thấy bài viết');
          return;
        }
        if (!postResponse.ok) {
          throw new Error('Lỗi khi tải bài viết');
        }
        if (!categoriesResponse.ok) {
          throw new Error('Lỗi khi tải danh mục');
        }
        
        const postData = await postResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        setPost(postData);
        setCategories(categoriesData);
        setFormData({
          title: postData.title,
          content: postData.content,
          status: postData.status,
          categoryId: postData.categories?.[0]?.id || '',
          publishedAt: postData.publishedAt || null
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form data being sent:', formData);
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Cập nhật thất bại');
      }

      toast.success('Cập nhật bài viết thành công');
      router.push('/dashboard/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Không tìm thấy bài viết</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chỉnh sửa bài viết</h2>
        <Button variant="outline" onClick={() => router.push('/dashboard/posts')}>
          Quay lại
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Tiêu đề
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Nhập tiêu đề"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Nội dung
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({...formData, content})}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Trạng thái
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({...formData, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
                <SelectItem value="DRAFT">Bản nháp</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Danh mục
            </label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({...formData, categoryId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/posts')}>
              Hủy
            </Button>
            <Button type="submit" onClick={() => {
              const updatedData = {
                ...formData,
                status: 'PUBLISHED',
                publishedAt: new Date().toISOString()
              };
              setFormData(updatedData);
            }}>
              Duyệt
            </Button>
            <Button type="button" variant="destructive" onClick={() => setFormData({...formData, status: 'REJECTED'})}>
              Từ chối
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}