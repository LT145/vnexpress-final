import { SidebarProps } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Sidebar = ({ userData }: SidebarProps) => (
  <aside className="w-full md:w-1/4">
    <Card>
      <CardContent className="p-6a">
        <div className="flex items-center space-x-4 mb-6 mt-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {userData?.name || "Người dùng"}
            </h2>
            <p className="text-sm text-gray-500">
              Thời gian tham gia: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : "N/A"}
            </p>
          </div>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/users/chi-tiet-tai-khoan">Thông tin chung</a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/users/feed/1108875933">Ý kiến của bạn (0)</a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/users/tin-da-luu">Tin đã lưu</a>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/users/tin-da-doc">Tin đã xem</a>
          </Button>
          <Button variant="destructive" className="w-full justify-start" asChild>
            <a href="javascript:void(0);" id="myvne_logout_link_left">Thoát</a>
          </Button>
        </nav>
      </CardContent>
    </Card>
  </aside>
);
