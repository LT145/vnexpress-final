"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const SIDEBAR_ITEMS = {
  ADMIN: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Quản lý người dùng", href: "/dashboard/users" },
    { title: "Quản lý bài viết", href: "/dashboard/posts" },
    { title: "Quản lý bình luận", href: "/dashboard/comments" },
    { title: "Quản lý quảng cáo", href: "/dashboard/advertisements" },
    { title: "Quản lý báo cáo", href: "/dashboard/reports" },
    { title: "Thống kê", href: "/dashboard/statistics" },
  ],
  EDITOR: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Quản lý bài viết", href: "/dashboard/posts" },
    { title: "Quản lý bình luận", href: "/dashboard/comments" },
    { title: "Thống kê", href: "/dashboard/statistics" },
  ],
  MODERATOR: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Quản lý bình luận", href: "/dashboard/comments" },
    { title: "Quản lý báo cáo", href: "/dashboard/reports" },
  ],
  ADVERTISER: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Quản lý quảng cáo", href: "/dashboard/advertisements" },
  ],
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role || "USER";
  const sidebarItems = SIDEBAR_ITEMS[role as keyof typeof SIDEBAR_ITEMS] || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <nav className="flex flex-col gap-1 p-4">
                  {sidebarItems.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className="block red rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 bg-white shadow-sm lg:block h-[100vh] overflow-y-auto">
          <nav className="flex flex-col gap-1 p-4">
            {sidebarItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  {item.title}
                </Link>
              </div>
            ))}
            <div>
              <Link
                href="/"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600"
              >
                Thoát
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;