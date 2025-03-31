"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Masonry from 'react-masonry-css';

export default function PostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const router = useRouter();

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', 'PENDING');
      
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gửi bài thất bại');
      }

      alert('Bài viết của bạn đã được gửi và đang chờ duyệt!');
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Đăng bài viết mới</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Nội dung</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded min-h-[200px]"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Ảnh bài viết</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const filesArray = Array.from(e.target.files);
                setImages(filesArray);
                const previews = filesArray.map(file => URL.createObjectURL(file));
                setImagePreviews(previews);
              }
            }}
            className="w-full p-2 border rounded"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="mb-2">Vị trí ảnh:</p>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {imagePreviews.map((item, index) => (
                  <div key={`item-${index}`} className="relative mb-4">
                    <img 
                      src={item} 
                      alt="Preview" 
                      className="w-full h-auto rounded"
                    />
                  </div>
                ))}
              </Masonry>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi bài'}
        </button>
      </form>
    </div>
  );
}