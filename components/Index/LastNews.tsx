'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image"; // Import the Image component from next/image
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/autoplay';

export default function LastNews() {
  interface Post {
    id: number;
    title: string;
    content: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    imageUrls: string[];
    status: string;
  }

  const [news, setNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/lastnews');
        const data = await response.json();
        setNews(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1 className="text-2xl font-bold mt-2 mb-4">Tin mới nhất</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col sm:flex-row gap-4 p-4">
              <Skeleton className="w-full sm:w-1/3 h-48 rounded-lg" />
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
      <h1 className="text-2xl font-bold mt-2 mb-4">Tin mới nhất</h1>
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        modules={[Autoplay]}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
      >
        {news.slice(0, 8).map((item) => {
          const firstImageMatch = item.content.match(/<img[^>]+src=\"(https?:\/\/[^\"]+)\"/);
          const firstImageUrl = firstImageMatch ? firstImageMatch[1] : item.imageUrls?.[0];

          return (
            <SwiperSlide key={item.id}>
              <Card className="overflow-hidden cursor-pointer" onClick={() => window.location.href = `/post/${item.id}`}>
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {firstImageUrl && (
                    <Image
                      src={firstImageUrl}
                      alt={item.title}
                      width={320}
                      height={192}
                      className="w-full sm:w-80 h-48 object-cover rounded-lg"
                      unoptimized
                    />
                  )}
                  <div className="flex-1">
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-gray-600 line-clamp-3">
                      {item.content.replace(/<[^>]+>/g, '')}
                    </CardContent>
                  </div>
                </div>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
