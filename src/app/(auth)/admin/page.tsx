"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser, useLogout } from "@/hook/useAuth";
import Chatbot from "@/components/Chatbot";
import CreateAccount from "@/components/CreateAccount";
import EditProfile from "@/components/EditProfile";
import SidebarManager from "@/components/SideBarManager";
import RoomList from "@/components/Room";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminPage() {
  const [activeMenuItem, setActiveMenuItem] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeMenuItem") || "agent";
    }
    return "agent";
  });

  const router = useRouter();
  const logout = useLogout();
  const { data: user, isLoading } = useCurrentUser();

  const handleMenuSelect = (menuId: string) => {
    if (menuId === "calendar") {
      sessionStorage.setItem("fromAdmin", "true");
      router.push("/user?fromAdmin=true");
      return;
    }

    setActiveMenuItem(menuId);
    localStorage.setItem("activeMenuItem", menuId);
  };

  const handleSignOut = () => {
    localStorage.removeItem("activeMenuItem");
    logout();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-2xl animate-spin" />
          </div>
          <p className="text-lg font-medium text-slate-700">
            Đang tải trang quản trị...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !user.roles?.includes("ADMIN")) {
    router.replace("/login");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        <SidebarManager
          activeMenuItem={activeMenuItem}
          onMenuSelect={handleMenuSelect}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 flex flex-col min-w-0 ml-57 overflow-hidden">
          {activeMenuItem === "agent" && <Chatbot />}
          
          {activeMenuItem === "create-account" && (
            <div className="flex-1 overflow-auto">
              <CreateAccount />
            </div>
          )}
          
          {activeMenuItem === "room" && (
            <div className="flex-1 overflow-auto">
              <RoomList />
            </div>
          )}
          
          {activeMenuItem === "edit" && (
            <div className="flex-1 overflow-auto">
              <EditProfile />
            </div>
          )}
          
          {activeMenuItem === "" && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse" />
                  <div className="relative w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <span className="text-6xl">👑</span>
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Chào mừng Quản trị viên
                </h1>
                <p className="text-xl text-slate-600 mb-2 font-medium">{user.email}</p>
                <p className="text-lg text-slate-500">
                  Chọn một mục từ menu để quản lý hệ thống
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}