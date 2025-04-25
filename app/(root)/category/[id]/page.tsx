"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: { name: string };
  imageUrls: string[];
  createdAt: string;
}

export default function CategoryNews({ params }: { params: { id: string } }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [postsByCategory, setPostsByCategory] = useState<Record<string, Post[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        const postsPromises = categoriesData.map(async (category: any) => {
          const postsRes = await fetch(`/api/categories/${category.name}`);
          return await postsRes.json();
        });

        const postsResults = await Promise.all(postsPromises);
        const postsMap: Record<string, Post[]> = {};
        categoriesData.forEach((category: Category, index: number) => {
          postsMap[category.name] = postsResults[index];
        });
        setPostsByCategory(postsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex gap-4 p-4">
              <Skeleton className="w-1/3 h-48 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="space-y-8">
        {categories
          .filter(category => category.id === params.id)
          .map((category) => {
            const posts = postsByCategory[category.name] || [];
            
            return (
              <div key={category.id} className="space-y-4">
                <h1 className="text-3xl text-center font-bold mt-6 mb-6">{category.name}</h1>
                {posts.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {posts.map((post) => {
                      const firstImageMatch = post.content.match(/<img[^>]+src="(https?:\/\/[^"]+)"/);
                      const firstImageUrl = firstImageMatch ? firstImageMatch[1] : post.imageUrls?.[0];

                      return (
                        <Card key={post.id} className="flex flex-row h-48 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={() => window.location.href = `/post/${post.id}`}>
                          <div className="w-1/3 relative">
                            <Image
                              src={firstImageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col flex-1 p-4">
                            <CardHeader className="p-0 mb-2">
                              <CardTitle className="text-lg font-semibold line-clamp-2">{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-gray-600 line-clamp-4 flex-1">
                              {post.content.replace(/<[^>]+>/g, '')}
                            </CardContent>
                            <div className="mt-3 text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không có bài viết nào
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}