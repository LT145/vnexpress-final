import { useState, useEffect } from 'react';
import { AccountInfoProps } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AccountInfo = ({
  isUploadingAvatar,
  isEditing,
  onAvatarChange,
  onEditName,
  onSaveName,
  onCancelName,
  onNameChange,
}: AccountInfoProps) => {
  const [userData, setUserData] = useState<any>({}); // có thể chỉnh lại type nếu muốn

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      formData.append('key', 'cf7ee3a824c1c821f2e6734fdbbfaa67');

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const avatarUrl = data.data.url;

        onAvatarChange({
          target: {
            files: [new File([e.target.files[0]], e.target.files[0].name)],
            avatarUrl
          }
        } as any);

        // cập nhật vào state để render ngay
        setUserData((prev: any) => ({
          ...prev,
          avatar: avatarUrl
        }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile/user');
        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Ảnh đại diện</h3>
              <div className="flex items-center space-x-4 mt-2">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={userData?.avatar || ""} alt={userData?.name || "User"} />
                  <AvatarFallback>
                    {userData?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <Label className="cursor-pointer text-blue-600 hover:underline">
              <Input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
              {isUploadingAvatar ? "Đang tải..." : "Thay ảnh đại diện"}
            </Label>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Họ tên</h3>
              {isEditing.name ? (
                <Input
                  type="text"
                  className="mt-2"
                  value={userData?.name || ""}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              ) : (
                <p className="text-gray-600 mt-2">{userData?.name || "Người Dùng"}</p>
              )}
            </div>
            {isEditing.name ? (
              <div className="space-x-2">
                <Button onClick={onSaveName} variant="default">Lưu</Button>
                <Button onClick={onCancelName} variant="secondary">Hủy</Button>
              </div>
            ) : (
              <Button variant="link" onClick={onEditName} className="text-blue-600">
                Thay đổi
              </Button>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="text-gray-600 mt-2">{userData?.email || "null"}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Mật khẩu</h3>
              <p className="text-gray-600 mt-2">************</p>
            </div>
            <Button variant="link" className="text-blue-600">Thay đổi</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
