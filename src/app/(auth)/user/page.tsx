"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import SidebarUser from "@/components/SideBarUser";
import Chatbot from "@/components/Chatbot";
import RoomList from "@/components/Room";
import EditProfile from "@/components/EditProfile";

import { useCurrentUser, useLogout } from "@/hook/useAuth";
import { ScheduleResponse } from "@/model/schedule.model";
import DetailSchedule from "@/components/DetailSchedule";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function UserPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  const [fromAdmin, setFromAdmin] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("fromAdmin") === "true";
    }
    return false;
  });

  const [selectedMeeting, setSelectedMeeting] =
    useState<ScheduleResponse | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activeMenuItem");
      if (!saved) return "agent";

      try {
        const parsed = JSON.parse(saved);
        return typeof parsed === "string" ? parsed : saved;
      } catch {
        return saved;
      }
    }
    return "agent";
  });
  
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("fromAdmin");
      }
    };
  }, []);

  const handleMenuSelect = (menuId: string) => {
    setActiveMenuItem(menuId);
    localStorage.setItem("activeMenuItem", menuId);
    setSelectedMeeting(null);
  };

  const handleMeetingSelect = (meeting: ScheduleResponse) => {
    setSelectedMeeting(meeting);
    setActiveMenuItem("");
  };

  const handleSignOut = () => {
    logout();
    localStorage.removeItem("activeMenuItem");
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

  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        <SidebarUser
          activeMenuItem={activeMenuItem}
          selectedMeetingId={selectedMeeting?.scheduleId.toString()}
          onMenuSelect={handleMenuSelect}
          onMeetingSelect={handleMeetingSelect}
          fromAdmin={fromAdmin}
          fromManager={fromAdmin}
        />

        <main className="flex-1 flex flex-col min-w-0 ml-57 overflow-hidden">
          {activeMenuItem === "" && !selectedMeeting && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse" />
                  <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <span className="text-6xl">👋</span>
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Xin chào, {user.email}!
                </h1>
                <p className="text-xl text-slate-600">
                  Chọn một mục từ menu bên trái để bắt đầu
                </p>
              </div>
            </div>
          )}

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

          {selectedMeeting && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto">
                <DetailSchedule
                  selectedMeeting={selectedMeeting}
                  userEmail={user.email}
                  onSignOut={handleSignOut}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
