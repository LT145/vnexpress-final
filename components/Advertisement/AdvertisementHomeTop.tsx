"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AdvertisementHome() {
  interface Advertisement {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    targetUrl: string;
  }

  const [ad, setAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch('/api/home-advertisements/top');
        const data = await response.json();
        setAd(data);
        // Gửi thông tin lượt hiển thị
        await fetch('/api/ad-metrics/impression', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ adId: data.id }),
        });
      } catch (error) {
        console.error('Error fetching home advertisement:', error);
      }
    };

    fetchAd();
  }, []);

  if (!ad) return null;

  return (
    <div className="container my-8">
      
        {ad.imageUrl && (
          <Image 
            src={ad.imageUrl} 
            alt={ad.title}
            className="w-full h-64 rounded-lg cursor-pointer"
            width={800} 
            height={100} 
            onClick={() => {  

      // Gửi thông tin lượt nhấp chuột
      fetch('/api/ad-metrics/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adId: ad.id }),
        
      });
      window.location.href = ad.targetUrl;
    }}
            unoptimized
          />
        )}
      </div>
  );
}