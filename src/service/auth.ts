import { apiClient } from '@/lib/api-client';
import {
  LoginRequest,
  TokenResponse,
} from '@/model/auth.model';
import {
  UserCreationRequest,
  UserUpdateRequest,
  ChangePasswordRequest,
  UserResponse,
} from '@/model/user.model';
import { ApiResponse } from '@/model/api-response.model';
import { RoleRepresentation } from '@/model/role.model';

const API_URL = 'http://localhost:8080/users';

export const authApi = {
  login: async (request: LoginRequest): Promise<ApiResponse<TokenResponse>> => {
    const res = await apiClient.post<ApiResponse<TokenResponse>>(
      `${API_URL}/login`,
      request
    );
    return res.data;
  },

  register: async (request: UserCreationRequest): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.post<ApiResponse<UserResponse>>(
      `${API_URL}/register`,
      request
    );
    return res.data;
  },

  getAllUsers: async (): Promise<ApiResponse<UserResponse[]>> => {
    const res = await apiClient.get<ApiResponse<UserResponse[]>>(
      `${API_URL}/all`
    );
    return res.data;
  },

  getMyProfile: async (): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.get<ApiResponse<UserResponse>>(
      `${API_URL}/my-profile`
    );
    return res.data;
  },

  getUser: async (keycloakId: string): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.get<ApiResponse<UserResponse>>(
      `${API_URL}/${keycloakId}`
    );
    return res.data;
  },

  getUserRoles: async (keycloakId: string): Promise<RoleRepresentation[]> => {
    const res = await apiClient.get<RoleRepresentation[]>(
      `${API_URL}/role/${keycloakId}`
    );
    return res.data;
  },

  updateProfile: async (
    keycloakId: string,
    request: UserUpdateRequest
  ): Promise<ApiResponse<UserResponse>> => {
    const res = await apiClient.put<ApiResponse<UserResponse>>(
      `${API_URL}/${keycloakId}`,
      request
    );
    return res.data;
  },

  changePassword: async (
    userId:string | number,
    request: ChangePasswordRequest
  ): Promise<ApiResponse<boolean>> => {
    const res = await apiClient.put<ApiResponse<boolean>>(
      `${API_URL}/${userId}/change-password`,
      request
    );
    return res.data;
  },
};
