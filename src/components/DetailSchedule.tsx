'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { ScheduleResponse } from '@/model/schedule.model';

interface DetailScheduleProps {
  selectedMeeting: ScheduleResponse | null;
  userEmail?: string;
  onSignOut?: () => void;
}

export default function DetailSchedule({
  selectedMeeting,
  userEmail = '',
}: DetailScheduleProps) {
  if (!selectedMeeting) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="text-center max-w-md">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full blur-3xl opacity-20" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center">
              <Calendar className="w-12 h-12 text-slate-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">
            Chưa có cuộc họp nào được chọn
          </h3>
          <p className="text-slate-500">
            Chọn một cuộc họp từ danh sách bên trái để xem chi tiết
          </p>
        </div>
      </div>
    );
  }

  const startTime = new Date(selectedMeeting.startTime);
  const endTime = new Date(selectedMeeting.endTime);

  const displayDate = format(startTime, 'dd/MM/yyyy', { locale: vi });
  const displayDayOfWeek = format(startTime, 'EEEE', { locale: vi });
  const displayTime = `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Đã lên lịch
                </Badge>
                <h1 className="text-3xl font-bold mb-2">
                  {selectedMeeting.title}
                </h1>
                {userEmail && (
                  <p className="text-blue-100 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Người tham gia: {userEmail}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Meeting Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Card */}
          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">Ngày họp</p>
                  <p className="text-xl font-bold text-slate-800">{displayDate}</p>
                  <p className="text-sm text-slate-600 mt-1 capitalize">{displayDayOfWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Card */}
          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">Thời gian</p>
                  <p className="text-xl font-bold text-slate-800">{displayTime}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Thời lượng: {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} phút
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Card */}
          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1">Phòng họp</p>
                  <p className="text-2xl font-bold text-slate-800 mb-2">
                    {selectedMeeting.room.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="text-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      {selectedMeeting.room.location}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Users className="w-3 h-3 mr-1" />
                      Sức chứa: {selectedMeeting.room.capacity} người
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Card */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-100">
            <CardTitle className="text-lg">Thông tin bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">Trạng thái</span>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Đã xác nhận
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">Mã lịch họp</span>
                <code className="px-3 py-1 bg-slate-800 text-white rounded-lg text-sm font-mono">
                  #{selectedMeeting.scheduleId}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}