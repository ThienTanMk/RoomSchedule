'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Bot,
  Calendar,
  Home,
  LogOut,
  UserPlus,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hook/useAuth';
import { useLogout } from '@/hook/useAuth';

interface SidebarManagerProps {
  activeMenuItem: string;
  onMenuSelect: (id: string) => void;
  onSignOut?: () => void; 
}

export default function SidebarManager({ activeMenuItem, onMenuSelect }: SidebarManagerProps) {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const isManager = user?.roles?.includes('MANAGER') && !user?.roles?.includes('ADMIN');
  const isAdmin = user?.roles?.includes('ADMIN');

  const menuItems = [
    { 
      id: 'agent', 
      label: 'AI Agent', 
      icon: Bot,
      gradient: 'from-blue-500 to-indigo-600'
    },
    ...(isManager ? [] : [{ 
      id: 'create-account', 
      label: 'Tạo tài khoản', 
      icon: UserPlus,
      gradient: 'from-purple-500 to-pink-600'
    }]),
    { 
      id: 'calendar', 
      label: 'Xem lịch họp', 
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'room', 
      label: 'Phòng họp', 
      icon: Home,
      gradient: 'from-orange-500 to-red-600'
    },
    { 
      id: 'edit', 
      label: 'Hồ sơ', 
      icon: Edit3,
      gradient: 'from-teal-500 to-cyan-600'
    },
  ];

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur-md opacity-40" />
            <Avatar className="relative h-12 w-12 border-2 border-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.email || 'admin@example.com'}
            </p>
            <Badge 
              variant="secondary" 
              className={`text-xs font-semibold mt-1 ${
                isAdmin 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0'
              }`}
            >
              {isManager ? '👔 Manager' : '👑 Administrator'}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu chính */}
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeMenuItem === item.id}
                onClick={() => onMenuSelect(item.id)}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                  activeMenuItem === item.id
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className={`p-2 rounded-lg mr-3 ${
                  activeMenuItem === item.id 
                    ? 'bg-white/20' 
                    : 'bg-slate-100'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{item.label}</span>
                {item.id === 'agent' && activeMenuItem === item.id && (
                  <Sparkles className="ml-auto h-4 w-4 animate-pulse" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer - Đăng xuất */}
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