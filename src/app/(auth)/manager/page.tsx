"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser, useLogout } from "@/hook/useAuth";
import Chatbot from "@/components/Chatbot";
import EditProfile from "@/components/EditProfile";
import SidebarManager from "@/components/SideBarManager";
import RoomList from "@/components/Room";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ManagerPage() {
  const [activeMenuItem, setActiveMenuItem] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeMenuItem") || "room";
    }
    return "room";
  });

  const router = useRouter();
  const logout = useLogout();
  const { data: user, isLoading } = useCurrentUser();

  const handleMenuSelect = (menuId: string) => {
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-2xl animate-spin" />
          </div>
          <p className="text-lg font-medium text-slate-700">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.roles?.includes("MANAGER")) {
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
          
          {activeMenuItem === "calendar" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg text-slate-600">Đang chuyển hướng...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}