"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Bot,
  Home,
  Edit3,
  LogOut,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useCurrentUser, useLogout } from "@/hook/useAuth";
import { useSchedulesByUser } from "@/hook/useSchedule";
import { ScheduleResponse } from "@/model/schedule.model";
import { useRouter, useSearchParams } from "next/navigation";

interface SidebarUserProps {
  activeMenuItem: string;
  selectedMeetingId?: string;
  onMenuSelect: (id: string) => void;
  onMeetingSelect: (meeting: ScheduleResponse) => void;
  fromAdmin?: boolean;
  fromManager?: boolean;
}

type TransformedMeeting = ScheduleResponse & {
  formattedDate: string;
  formattedTime: string;
  isRead: boolean;
};

type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  gradient?: string;
};

const READ_MEETINGS_KEY = "read_meetings";

export default function SidebarUser({
  activeMenuItem,
  selectedMeetingId,
  onMenuSelect,
  onMeetingSelect,
  fromAdmin: fromAdminProp = false,
  fromManager: fromManagerProp = false,
}: SidebarUserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useCurrentUser();
  const { data: schedulesRes, isLoading } = useSchedulesByUser(
    user?.keycloakId
  );
  const logout = useLogout();

  const [showMeetingHistory, setShowMeetingHistory] = useState(true);
  const [readMeetings, setReadMeetings] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(READ_MEETINGS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const [fromAdmin, setFromAdmin] = useState(() => {
    if (typeof window !== "undefined") {
      const fromUrl =
        new URLSearchParams(window.location.search).get("fromAdmin") === "true";
      const fromSession = sessionStorage.getItem("fromAdmin") === "true";
      const isFromAdmin = fromUrl || fromSession;

      if (isFromAdmin) {
        sessionStorage.setItem("fromAdmin", "true");
      }

      return isFromAdmin;
    }
    return fromAdminProp;
  });

  const [fromManager, setFromManager] = useState(() => {
    if (typeof window !== "undefined") {
      const fromUrl =
        new URLSearchParams(window.location.search).get("fromManager") ===
        "true";
      const fromSession = sessionStorage.getItem("fromManager") === "true";
      const isFromManager = fromUrl || fromSession;

      if (isFromManager) {
        sessionStorage.setItem("fromManager", "true");
      }

      return isFromManager;
    }
    return fromManagerProp;
  });

  const meetings =
    schedulesRes?.data?.map((schedule: ScheduleResponse) => {
      const start = new Date(schedule.startTime);
      const end = new Date(schedule.endTime);

      return {
        ...schedule,
        formattedDate: format(start, "dd/MM/yyyy", { locale: vi }),
        formattedTime: `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
        isRead: readMeetings.has(schedule.scheduleId.toString()),
      };
    }) || [];

  const unreadCount = meetings.filter((m) => !m.isRead).length;

  const handleMeetingClick = (meeting: TransformedMeeting) => {
    if (!meeting.isRead) {
      const newRead = new Set(readMeetings);
      newRead.add(meeting.scheduleId.toString());
      setReadMeetings(newRead);
      localStorage.setItem(
        READ_MEETINGS_KEY,
        JSON.stringify(Array.from(newRead))
      );
    }
    onMeetingSelect(meeting);
  };

  const handleBackToAdmin = () => {
    sessionStorage.removeItem("fromAdmin");
    router.push("/admin");
  };

  const menuItems: MenuItem[] = [];

  if (fromAdmin) {
    menuItems.push({
      id: "back",
      label: "Trở về",
      icon: ArrowLeft,
      onClick: handleBackToAdmin,
      gradient: "from-purple-500 to-pink-600",
    });
  } else {
    menuItems.push(
      {
        id: "agent",
        label: "AI Agent",
        icon: Bot,
        gradient: "from-blue-500 to-indigo-600",
      },
      {
        id: "room",
        label: "Phòng họp",
        icon: Home,
        gradient: "from-orange-500 to-red-600",
      },
      {
        id: "edit",
        label: "Hồ sơ",
        icon: Edit3,
        gradient: "from-teal-500 to-cyan-600",
      }
    );
  }

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur-md opacity-40" />
            <Avatar className="relative h-12 w-12 border-2 border-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.email || "user@example.com"}
            </p>
            <Badge
              variant="secondary"
              className="text-xs font-semibold mt-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0"
            >
              👤 Người dùng
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1">
          {/* Navigation Menu */}
          <div className="p-4">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item: MenuItem) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeMenuItem === item.id}
                    onClick={() =>
                      item.onClick ? item.onClick() : onMenuSelect(item.id)
                    }
                    className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                      activeMenuItem === item.id
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                        : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mr-3 ${
                        activeMenuItem === item.id
                          ? "bg-white/20"
                          : "bg-slate-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {item.id === "agent" && activeMenuItem === item.id && (
                      <Sparkles className="ml-auto h-4 w-4 animate-pulse" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>

          <Separator className="mx-4" />

          {/* Meeting History Section */}
          <div className="p-4">
            <button
              onClick={() => setShowMeetingHistory(!showMeetingHistory)}
              className="flex w-full items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-800">Lịch họp</span>
                <div className="ml-10 border-0 animate-pulse">
                  {unreadCount > 0 && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
              {showMeetingHistory ? (
                <ChevronDown className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
              ) : (
                <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
              )}
            </button>

            {showMeetingHistory && (
              <div className="mt-3 space-y-2">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Đang tải...</p>
                  </div>
                ) : meetings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm text-slate-500">Chưa có lịch họp</p>
                  </div>
                ) : (
                  meetings.map((meeting: TransformedMeeting) => (
                    <div
                      key={meeting.scheduleId}
                      onClick={() => handleMeetingClick(meeting)}
                      className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${
                        selectedMeetingId === meeting.scheduleId.toString()
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-600 shadow-lg scale-105"
                          : meeting.isRead
                          ? "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                          : "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-400"
                      }`}
                    >
                      <h3
                        className={`font-semibold text-sm mb-2 flex items-center gap-2 ${
                          selectedMeetingId === meeting.scheduleId.toString()
                            ? "text-white"
                            : "text-slate-800"
                        }`}
                      >
                        {meeting.title}
                        {!meeting.isRead && (
                          <Badge className="bg-red-500 text-white text-xs px-2">
                            Mới
                          </Badge>
                        )}
                      </h3>
                      <div
                        className={`space-y-1.5 text-xs ${
                          selectedMeetingId === meeting.scheduleId.toString()
                            ? "text-blue-100"
                            : "text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-medium">
                            {meeting.formattedDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="font-medium">
                            {meeting.formattedTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="font-medium">
                            {meeting.room.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>

      <div className="ml-5 ms-2 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-slate-800">
          Tổng lịch họp: {meetings.length}
        </span>
      </div>
      {/* Footer - Logout */}
      <SidebarFooter className="p-4 border-t border-slate-100">
        <SidebarMenuButton
          onClick={logout}
          className="w-full justify-start h-12 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="font-medium">Đăng xuất</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
