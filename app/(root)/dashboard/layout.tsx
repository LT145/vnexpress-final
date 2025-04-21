"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Quản lý người dùng", href: "/dashboard/users" },
  { title: "Quản lý bài viết", href: "/dashboard/posts" },
  { title: "Quản lý bình luận", href: "/dashboard/comments" },
  { title: "Quản lý quảng cáo", href: "/dashboard/advertisements" },
  { title: "Quản lý báo cáo", href: "/dashboard/reports" },
  { title: "Thống kê", href: "/dashboard/statistics" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {item.title}
                    </Link>
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
        <aside className="hidden w-64 bg-white shadow-sm lg:block">
          <nav className="flex flex-col gap-1 p-4">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;