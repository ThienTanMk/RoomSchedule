import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/model/api-response.model';
import { AssignRoleRequest } from '@/model/role.model';


const API_URL = 'http://localhost:8080/roles';

export const roleApi = {
  assign: async (userId: number, request: AssignRoleRequest): Promise<ApiResponse<string>> => {
    const res = await apiClient.post(`${API_URL}/assign/${userId}`, request);
    return res.data;
  },

  unassign: async (userId: number, request: AssignRoleRequest): Promise<ApiResponse<string>> => {
    const res = await apiClient.delete(`${API_URL}/unassign/${userId}`, {
      data: request,
    });
    return res.data;
  },
};
