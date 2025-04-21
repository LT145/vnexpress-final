  "use client";

  import { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import RichTextEditor from "@/components/RichTextEditor";

  export default function PostPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const router = useRouter();

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/categories");
          if (!response.ok) throw new Error("Failed to fetch categories");
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError("");

      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("status", "DRAFT"); // hoặc bất kỳ trạng thái hợp lệ nào

        formData.append("categoryId", selectedCategory);

        const response = await fetch("/api/posts", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Gửi bài thất bại");
        }

        alert("Bài viết của bạn đã được gửi và đang chờ duyệt!");
        router.push("/");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center">Đăng bài viết mới</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Danh mục */}
          <div>
            <Label>Danh mục</Label>
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-base">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tiêu đề */}
          <div>
            <Label>Tiêu đề</Label>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {/* Nội dung */}
          <div>
            <Label>Nội dung</Label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* Nút Gửi */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi bài"}
          </Button>
        </form>
      </div>
    );
  }
