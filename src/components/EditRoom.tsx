'use client';

import { useForm, SubmitHandler, type Resolver, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, MapPin, Users, Home } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { RoomRequest } from '@/model/room.model';
import { useEffect } from 'react';

const roomSchema = z.object({
  name: z.string().min(1, 'Tên phòng không được để trống'),
  location: z.string().min(1, 'Vị trí không được để trống'),
  capacity: z.coerce.number().min(1, 'Sức chứa phải lớn hơn 0'),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface EditRoomProps {
  open: boolean;
  isEditMode: boolean;
  room?: RoomRequest;
  onOpenChange: (open: boolean) => void;
  onSave: (data: RoomRequest) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function EditRoom({
  open,
  isEditMode,
  room = { name: '', location: '', capacity: 10 },
  onOpenChange,
  onSave,
  isLoading = false,
  error = null,
}: EditRoomProps) {
  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema) as Resolver<RoomFormData>,
    defaultValues: {
      name: room.name ?? '',
      location: room.location ?? '',
      capacity: room.capacity ?? 10,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: room.name ?? '',
        location: room.location ?? '',
        capacity: room.capacity ?? 10,
      });
    }
  }, [open, room, form]);

  const onSubmit: SubmitHandler<RoomFormData> = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-slate-200 rounded-2xl">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">
              {isEditMode ? 'Chỉnh sửa phòng họp' : 'Tạo phòng họp mới'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-600">
            {isEditMode
              ? 'Cập nhật thông tin phòng họp'
              : 'Thêm một phòng họp mới vào hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control as Control<RoomFormData>}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Home className="w-4 h-4 text-slate-500" />
                    Tên phòng
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Phòng A101" 
                      {...field} 
                      disabled={isLoading} 
                      className="rounded-xl border-slate-200 h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    Vị trí
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Tầng 3, Tòa nhà A" 
                      {...field} 
                      disabled={isLoading} 
                      className="rounded-xl border-slate-200 h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as Control<RoomFormData>}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    Sức chứa
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="10"
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="rounded-xl border-slate-200 h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : isEditMode ? (
                  'Cập nhật'
                ) : (
                  'Tạo mới'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}