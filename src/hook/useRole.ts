import { roleApi } from '@/service/role';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAssignRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: Parameters<typeof roleApi.assign>[0]; data: Parameters<typeof roleApi.assign>[1] }) =>
      roleApi.assign(userId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useUnassignRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: Parameters<typeof roleApi.unassign>[0]; data: Parameters<typeof roleApi.unassign>[1] }) =>
      roleApi.unassign(userId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};