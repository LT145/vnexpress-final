'use client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const SavedPostsPage = () => {
  const [loading, setLoading] = useState(true);
  interface Post {
  id: string;
  title: string;
  content: string;
  imageUrls?: string[];
  createdAt: string;
  commentsCount?: number;
}

const [posts, setPosts] = useState<Post[]>([]);
const { data: session } = useSession();
const router = useRouter();
  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await fetch('/api/saved-posts');
        const data = await response.json();
        const postDetails = await Promise.all(data.map(async (post:any) => {
          const res = await fetch(`/api/postdetail?id=${post.postId}`);
          return res.json();
        }));
        console.log('Dữ liệu bài viết đã lưu:', postDetails);
        setPosts(postDetails);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="font-serif font-semibold text-4xl mb-4 mt-4 text-center">Tin đã lưu</h2>
      <div className="">
        {posts.length === 0 && (
          <div className="text-center text-gray-500 py-8">Không có tin nào được lưu</div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="flex items-start space-x-3 pt-3 pb-3 border-b border-gray-300 cursor-pointer hover:bg-gray-200 hover:shadow-sm transition-all duration-200" onClick={() => router.push(`/post/${post.id}`)}>
            <Image
              src={post.content.match(/<img[^>]+src="(https?:\/\/[^"]+)"/)?.[1] || (post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : '/default-image.jpg')}
              alt={post.title}
              width={200}
              height={120}
              className="w-[200px] h-[120px] object-cover flex-shrink-0 "
              unoptimized
            />
            <div className="flex-1">
              <p className="text-gray-900 font-bold mb-2 text-lg">{post.title}</p>
              <div className="flex items-center text-gray-500 text-sm font-serif space-x-4 mt-2">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center space-x-1 relative">
                  <i className="far fa-comment"></i>
                  <span className="text-red-700 font-semibold">{post.commentsCount || 0}</span>
                </div>
                <div 
                  className="relative group"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const method = 'DELETE';
                      const response = await fetch('/api/postdetail/save', {
                        method,
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          postId: post.id,
                          userId: session?.user?.id
                        }),
                      });
                      if (!response.ok) throw new Error('Hủy lưu thất bại');
                      setPosts(posts.filter(p => p.id !== post.id));
                    } catch (error) {
                      console.error('Lỗi khi hủy lưu bài viết:', error);
                    }
                  }}
                >
                  <i className="fas fa-bookmark text-red-700 cursor-pointer hover:text-red-900 transition-colors duration-200"></i>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Bỏ lưu
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPostsPage;