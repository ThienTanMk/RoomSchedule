import { departmentApi } from '@/service/department';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  detail: (id: number) => [...departmentKeys.all, id] as const,
  users: (id: number) => [...departmentKeys.all, 'users', id] as const,
};

export const useCreateDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: departmentApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: departmentKeys.lists() }),
  });
};

export const useGetAllDepartments = () => {
  return useQuery({
    queryKey: departmentKeys.lists(),
    queryFn: () => departmentApi.getAll(),
  });
};

export const useGetDepartment = (id: number) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentApi.getById(id),
    enabled: !!id,
  });
};

export const useGetUsersInDepartment = (id: number) => {
  return useQuery({
    queryKey: departmentKeys.users(id),
    queryFn: () => departmentApi.getUsers(id),
    enabled: !!id,
  });
};

export const useDeleteDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: departmentApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: departmentKeys.lists() }),
  });
};