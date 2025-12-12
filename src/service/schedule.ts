import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/model/api-response.model';
import { FreeTimeSlot } from '@/model/free-time-slot.model';
import { ScheduleByDepartmentRequest, ScheduleCreationRequest, ScheduleResponse, ScheduleUpdateRequest } from '@/model/schedule.model';

const API_URL = 'http://localhost:8080/schedules';

export const scheduleApi = {
  create: async (request: ScheduleCreationRequest): Promise<ApiResponse<ScheduleResponse>> => {
    const res = await apiClient.post(`${API_URL}`, request);
    return res.data;
  },

  createForDepartment: async (
    departmentName: string,
    request: ScheduleByDepartmentRequest
  ): Promise<ApiResponse<ScheduleResponse>> => {
    const res = await apiClient.post(`${API_URL}/departments/${departmentName}`, request);
    return res.data;
  },

  createSimple: async (request: ScheduleByDepartmentRequest): Promise<ApiResponse<ScheduleResponse>> => {
    const res = await apiClient.post(`${API_URL}/simple`, request);
    return res.data;
  },

  getByKeycloakId: async (keycloakId: string): Promise<ApiResponse<ScheduleResponse[]>> => {
    const res = await apiClient.get(`${API_URL}/users/${keycloakId}`);
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<ScheduleResponse>> => {
    const res = await apiClient.get(`${API_URL}/${id}`);
    return res.data;
  },

  update: async (id: number, request: ScheduleUpdateRequest): Promise<ApiResponse<ScheduleResponse>> => {
    const res = await apiClient.put(`${API_URL}/${id}`, request);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete(`${API_URL}/${id}`);
    return res.data;
  },

  getFreeSlots: async (
    roomName: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<FreeTimeSlot[]>> => {
    const res = await apiClient.get(
      `${API_URL}/free/${roomName}?startDate=${startDate}&endDate=${endDate}`
    );
    return res.data;
  },
};
