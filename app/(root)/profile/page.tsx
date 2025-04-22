"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/Profile/Sidebar";
import { AccountInfo } from "@/components/Profile/AccountInfo";
import { PersonalInfo } from "@/components/Profile/PersonalInfo";
import type { UserData, ProfileData, EditingState } from '@/types';

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    birthDate: "",
    gender: "",
    phone: "",
    address: "",
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditing, setIsEditing] = useState<EditingState>({
    birthDate: false,
    gender: false,
    phone: false,
    address: false,
    name: false,
  });

  const { data: session } = useSession();
  const user = session?.user;
  const createdAt = session?.expires;
  
  console.log('User data from session:', user);
  useEffect(() => {
    const fetchProfileData = async (user:any) => {
      try {
        if (user) {
          console.log('User data from session:', user);
          setUserData({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: createdAt,
          });

          const response = await fetch(`/api/profile/${user.id}`);
          if (!response.ok) throw new Error('Failed to fetch profile');
          
          const data = await response.json();
          console.log('Profile data received:', data); // Add logging

          if (data && data.profile) {  // Check for data.profile instead of just data
            setProfileData({
              birthDate: data.profile.birthDate || "",
              gender: data.profile.gender || "",
              phone: data.profile.phone || "",
              address: data.profile.address || "",
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      fetchProfileData(user);
    }
  }, [user, createdAt]); // Add 'createdAt' to the dependency array

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return;
      
      try {
        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        formData.append('key', 'd56688ff153b4c9dcb972fab16a5aadd');
  
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (data.success) {
          const avatarUrl = data.data.url;
          
          // Update local state
          setUserData(prev => prev ? { ...prev, avatar: avatarUrl } : null);
          
          // Update localStorage
          // Session sẽ được tự động cập nhật bởi next-auth
  
          // Update backend
          await fetch('/api/profile/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userData?.id,
              avatar: avatarUrl,
            }),
          });
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
        alert('Failed to update avatar');
      } finally {
        setIsUploadingAvatar(false);
      }
    };

  const handleSaveName = async () => {
    try {
      const response = await fetch('/api/profile/update', {  // Changed endpoint
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData?.id,
          name: userData?.name,
        }),
      });

      if (!response.ok) throw new Error('Update failed');

      // Session sẽ được tự động cập nhật bởi next-auth
      setIsEditing(prev => ({ ...prev, name: false }));
      alert('Cập nhật thành công!');
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleEdit = (field: keyof EditingState) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async (field: keyof EditingState) => {
    try {
      const response = await fetch('/api/profile/update', {  // Changed endpoint
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData?.id,
          [field]: profileData[field as keyof ProfileData],
        }),
      });

      if (!response.ok) throw new Error('Update failed');
      
      const updatedData = await response.json();
      if (field in profileData) {
        setProfileData(prev => ({
          ...prev,
          [field]: updatedData[field] || profileData[field as keyof ProfileData],
        }));
      }

      setIsEditing(prev => ({ ...prev, [field]: false }));
      alert('Cập nhật thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleCancel = (field: keyof EditingState) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar userData={userData} />
          <main className="w-full md:w-3/4">
            <AccountInfo
              userData={userData}
              isUploadingAvatar={isUploadingAvatar}
              isEditing={isEditing}
              onAvatarChange={handleAvatarChange}
              onEditName={() => {
                setUserData(prev => prev ? { ...prev, _originalName: prev.name } : null);
                setIsEditing(prev => ({ ...prev, name: true }));
              }}
              onSaveName={handleSaveName}
              onCancelName={() => {
                setIsEditing(prev => ({ ...prev, name: false }));
                setUserData(prev => ({ ...prev!, name: prev!._originalName! }));
              }}
              onNameChange={(name) => setUserData(prev => ({ ...prev!, name }))}
            />
            <PersonalInfo
              profileData={profileData}
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onFieldChange={(field, value) => 
                setProfileData(prev => ({ ...prev, [field]: value }))
              }
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
