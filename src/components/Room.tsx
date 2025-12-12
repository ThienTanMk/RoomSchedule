'use client';

import { useState } from 'react';
import { MapPin, Users, Plus, Edit2, Trash2, Loader2, Search, RotateCcw, Building2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import EditRoom from './EditRoom';

import { useCurrentUser } from '@/hook/useAuth';
import {
  useRoomsWithStatus,
  useAvailableRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from '@/hook/useRoom';
import { RoomRequest, RoomResponse, RoomWithStatus } from '@/model/room.model';

export default function RoomList() {
  const { data: user } = useCurrentUser();
  const isAdmin = user?.roles?.includes('ADMIN') ?? false;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomResponse | null>(null);

  const { data: allRoomsRes, isLoading: loadingAll } = useRoomsWithStatus();
  const { data: availableRes, isFetching: loadingAvailable } = useAvailableRooms(startDate, endDate);

  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom();
  const deleteMutation = useDeleteRoom();

  const roomsData = showAvailableOnly ? availableRes?.data : allRoomsRes?.data;
  const isLoading = showAvailableOnly ? loadingAvailable : loadingAll;

  const roomsByLocation = roomsData?.reduce((acc, room) => {
    const loc = room.location;
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(room);
    return acc;
  }, {} as Record<string, (RoomResponse | RoomWithStatus)[]>) ?? {};

  const locations = Object.keys(roomsByLocation).sort();

  const searchAvailable = () => {
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn cả ngày bắt đầu và kết thúc');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    setShowAvailableOnly(true);
  };

  const resetSearch = () => {
    setStartDate('');
    setEndDate('');
    setShowAvailableOnly(false);
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingRoom(null);
    setShowModal(true);
  };

  const openEditModal = (room: RoomResponse) => {
    setIsEditMode(true);
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleSave = (data: RoomRequest) => {
    if (isEditMode && editingRoom?.roomId) {
      updateMutation.mutate(
        { id: editingRoom.roomId, data },
        {
          onSuccess: () => {
            toast.success('Cập nhật phòng thành công!');
            setShowModal(false);
          },
          onError: () => toast.error('Không thể cập nhật phòng'),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Tạo phòng mới thành công!');
          setShowModal(false);
        },
        onError: () => toast.error('Không thể tạo phòng'),
      });
    }
  };

  const handleDelete = (room: RoomResponse) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng này?')) return;
    deleteMutation.mutate(room.roomId!, {
      onSuccess: () => toast.success('Xóa phòng thành công!'),
      onError: () => toast.error('Không thể xóa phòng'),
    });
  };

  return (
    <>
      <Toaster position="top-center" richColors closeButton />

      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Danh sách phòng họp
            </h1>
            <p className="text-slate-500 mt-2">Quản lý và tìm kiếm phòng họp</p>
          </div>
          {isAdmin && (
            <Button onClick={openCreateModal} size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl rounded-xl">
              <Plus className="w-5 h-5" />
              Tạo phòng mới
            </Button>
          )}
        </div>

        {/* Search Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Tìm phòng trống
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Từ ngày giờ</Label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1.5 rounded-xl border-slate-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Đến ngày giờ</Label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1.5 rounded-xl border-slate-200"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={searchAvailable} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl">
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </Button>
                {showAvailableOnly && (
                  <Button variant="outline" onClick={resetSearch} className="h-11 rounded-xl">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Đặt lại
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center py-20">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-2xl animate-spin" />
            </div>
            <p className="text-lg font-medium text-slate-700">Đang tải danh sách phòng...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !roomsData?.length && (
          <Card className="border-dashed border-2 border-slate-300">
            <CardContent className="py-16 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {showAvailableOnly ? 'Không có phòng trống' : 'Chưa có phòng họp'}
              </h3>
              <p className="text-slate-500">
                {showAvailableOnly
                  ? 'Không có phòng trống trong khoảng thời gian này'
                  : 'Chưa có phòng họp nào được tạo'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Rooms Grid */}
        {!isLoading && locations.length > 0 && (
          <div className="space-y-12">
            {locations.map((location) => (
              <section key={location}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  {location}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {roomsByLocation[location].map((room) => {
                    const withStatus = room as RoomWithStatus;
                    const isBooked = withStatus.status === 'BOOKED';

                    return (
                      <Card
                        key={room.roomId}
                        className={`group hover:shadow-xl transition-all duration-300 border-2 ${
                          isBooked 
                            ? 'border-red-200 hover:border-red-300 bg-gradient-to-br from-red-50 to-white' 
                            : 'border-green-200 hover:border-green-300 bg-gradient-to-br from-green-50 to-white'
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold text-slate-800">{room.name}</CardTitle>
                            {!showAvailableOnly && withStatus.status && (
                              <Badge 
                                variant={isBooked ? 'destructive' : 'default'} 
                                className="font-semibold"
                              >
                                {isBooked ? '📅 Đã đặt' : '✅ Trống'}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{room.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="w-4 h-4 text-indigo-600" />
                            <span className="font-medium">Sức chứa: {room.capacity} người</span>
                          </div>

                          {isAdmin && !isBooked && (
                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                onClick={() => openEditModal(room as RoomResponse)}
                              >
                                <Edit2 className="w-4 h-4 mr-1" />
                                Sửa
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                onClick={() => handleDelete(room as RoomResponse)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Xóa
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <EditRoom
        open={showModal}
        isEditMode={isEditMode}
        room={
          isEditMode && editingRoom
            ? {
                name: editingRoom.name,
                location: editingRoom.location,
                capacity: editingRoom.capacity,
              }
            : { name: '', location: '', capacity: 10 }
        }
        onOpenChange={setShowModal}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}