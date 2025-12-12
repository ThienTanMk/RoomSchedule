import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/model/api-response.model';
import { RoomRequest, RoomResponse, RoomWithStatus } from '@/model/room.model';


const API_URL = 'http://localhost:8080/rooms';

export const roomApi = {
  getWithStatus: async (): Promise<ApiResponse<RoomWithStatus[]>> => {
    const res = await apiClient.get(`${API_URL}/with-status`);
    return res.data;
  },

  getAvailable: async (startDate: string, endDate: string): Promise<ApiResponse<RoomResponse[]>> => {
    const res = await apiClient.get(`${API_URL}/available`, {
      params: { startDate, endDate },
    });
    return res.data;
  },

  getAll: async (): Promise<ApiResponse<RoomResponse[]>> => {
    const res = await apiClient.get(`${API_URL}/all`);
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<RoomResponse>> => {
    const res = await apiClient.get(`${API_URL}/${id}`);
    return res.data;
  },

  create: async (request: RoomRequest): Promise<ApiResponse<RoomResponse>> => {
    const res = await apiClient.post(`${API_URL}`, request);
    return res.data;
  },

  update: async (id: number, request: RoomRequest): Promise<ApiResponse<RoomResponse>> => {
    const res = await apiClient.put(`${API_URL}/${id}`, request);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
