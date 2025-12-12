import { roomApi } from '@/service/room';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  withStatus: () => [...roomKeys.all, 'with-status'] as const,
  available: (start: string, end: string) => [...roomKeys.all, 'available', start, end] as const,
  detail: (id: number) => [...roomKeys.all, id] as const,
};

export const useRoomsWithStatus = () => useQuery({
  queryKey: roomKeys.withStatus(),
  queryFn: roomApi.getWithStatus,
});

export const useAvailableRooms = (startDate?: string, endDate?: string) => {
  const enabled = !!startDate && !!endDate;
  return useQuery({
    queryKey: roomKeys.available(startDate!, endDate!),
    queryFn: () => roomApi.getAvailable(startDate!, endDate!),
    enabled,
  });
};

export const useAllRooms = () => useQuery({
  queryKey: roomKeys.lists(),
  queryFn: roomApi.getAll,
});

export const useRoom = (id: number) => useQuery({
  queryKey: roomKeys.detail(id),
  queryFn: () => roomApi.getById(id),
  enabled: !!id,
});

export const useCreateRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roomApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.lists() }),
  });
};

export const useUpdateRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: Parameters<typeof roomApi.update>[0]; data: Parameters<typeof roomApi.update>[1]; }) =>
      roomApi.update(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
};

export const useDeleteRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roomApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.lists() }),
  });
};