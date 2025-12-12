import { apiClient } from '@/lib/api-client';
import { DepartmentCreationRequest, DepartmentResponse } from '@/model/department.model';
import { ApiResponse } from '@/model/api-response.model';
import { UserResponse } from '@/model/user.model';

const API_URL = 'http://localhost:8080/departments';

export const departmentApi = {
  create: async (request: DepartmentCreationRequest): Promise<ApiResponse<DepartmentResponse>> => {
    const res = await apiClient.post(`${API_URL}`, request);
    return res.data;
  },

  getAll: async (): Promise<ApiResponse<DepartmentResponse[]>> => {
    const res = await apiClient.get(`${API_URL}/all`);
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<DepartmentResponse>> => {
    const res = await apiClient.get(`${API_URL}/${id}`);
    return res.data;
  },

  getUsers: async (id: number): Promise<ApiResponse<UserResponse[]>> => {
    const res = await apiClient.get(`${API_URL}/${id}/users`);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
