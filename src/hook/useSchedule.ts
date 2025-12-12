import { ScheduleByDepartmentRequest, ScheduleUpdateRequest } from '@/model/schedule.model';
import { scheduleApi } from '../service/schedule';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const scheduleKeys = {
  all: ['schedules'] as const,
  byUser: (id: string) => [...scheduleKeys.all, 'user', id] as const,
  detail: (id: number) => [...scheduleKeys.all, id] as const,
  freeSlots: (room: string, start: string, end: string) =>
    [...scheduleKeys.all, 'free', room, start, end] as const,
};

export const useCreateSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: scheduleApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
};

export const useCreateScheduleForDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentName, request }: { departmentName: string; request: ScheduleByDepartmentRequest }) =>
      scheduleApi.createForDepartment(departmentName, request),
    onSuccess: () => qc.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
};

export const useCreateSimpleSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: scheduleApi.createSimple,
    onSuccess: () => qc.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
};

export const useSchedulesByUser = (keycloakId?: string) => {
  return useQuery({
    queryKey: scheduleKeys.byUser(keycloakId!),
    queryFn: () => scheduleApi.getByKeycloakId(keycloakId!),
    enabled: !!keycloakId,
  });
};

export const useSchedule = (id: number) => {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => scheduleApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ScheduleUpdateRequest }) => scheduleApi.update(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: scheduleKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
};

export const useDeleteSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: scheduleApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
};

export const useFreeTimeSlots = (roomName: string, startDate?: Date, endDate?: Date) => {
  const enabled = !!startDate && !!endDate;
  const start = startDate?.toISOString();
  const end = endDate?.toISOString();

  return useQuery({
    queryKey: scheduleKeys.freeSlots(roomName, start!, end!),
    queryFn: () => scheduleApi.getFreeSlots(roomName, start!, end!),
    enabled,
  });
};