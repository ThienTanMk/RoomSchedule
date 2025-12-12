import { authApi } from '@/service/auth';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, TokenResponse } from '@/model/auth.model';
import { JwtPayload } from '@/model/jwt-payload.model';
import { ApiResponse } from '@/model/api-response.model';
import { UserUpdateRequest, ChangePasswordRequest, UserResponse, CurrentUser } from '@/model/user.model';
import { ApiError } from 'next/dist/server/api-utils';
import { AxiosError } from 'axios';
import { AuthUtils } from '@/lib/auth-utils';

export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation<ApiResponse<TokenResponse>, unknown, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      const token = res.data.accessToken;

      AuthUtils.setToken(token);

      const decoded = AuthUtils.decodeToken();
      if (decoded) {
        AuthUtils.setCurrentUser({
          keycloakId: decoded.sub,
          username: decoded.preferred_username,
          firstname: decoded.given_name,
          lastname: decoded.family_name,
          email: decoded.email,
          roles: decoded.realm_access?.roles || [],
          userId: 0,
          dob: "",
          department: { departmentId: "", name: "" },
        });
      }
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {

      const token = AuthUtils.getToken();
      if (!token) return null;

      const payload = AuthUtils.decodeToken(token);
      if (!payload) return null;

      const roles =
        payload.realm_access?.roles ||
        [];

      const res = await authApi.getMyProfile();
      const profile = res.data;

      const merged = {
        ...profile,
        roles,
      };
      AuthUtils.setCurrentUser(merged);

      return merged;
    },
    staleTime: Infinity,
  });
};

export const useLogout = () => {
  const qc = useQueryClient();

  return () => {
    AuthUtils.logout();
    qc.clear();
    window.location.href = "/login";
  };
};

export const useRegister = () => useMutation({ mutationFn: authApi.register });

export const useUser = (keycloakId: string) => {
  return useQuery({
    queryKey: ['users', keycloakId],
    queryFn: () => authApi.getUser(keycloakId),
    enabled: !!keycloakId,
  });
};

export const useAllUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: authApi.getAllUsers,
});

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<UserResponse>,
    AxiosError<ApiError>,
    { keycloakId: string; data: UserUpdateRequest }>({
      mutationFn: ({ keycloakId, data }: { keycloakId: string; data: UserUpdateRequest }) =>
        authApi.updateProfile(keycloakId, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['auth', 'me'] }),
    });
};

export const useUserRoles = (keycloakId: string) => {
  return useQuery({
    queryKey: ['users', 'roles', keycloakId],
    queryFn: () => authApi.getUserRoles(keycloakId),
    enabled: !!keycloakId,
  });
};

export const useUsersRoles = (users: { keycloakId: string }[]) => {
  return useQueries({
    queries: users.map((u) => ({
      queryKey: ["users", "roles", u.keycloakId],
      queryFn: () => authApi.getUserRoles(u.keycloakId),
      enabled: !!u.keycloakId,
    })),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string | number; data: ChangePasswordRequest }) =>
      authApi.changePassword(userId, data),
  });
};

export const useRole = () => {
  const isAdmin = AuthUtils.isAdmin();
  const isManager = AuthUtils.isManager();
  const isUser = AuthUtils.isUser();

  return { isAdmin, isManager, isUser };
};
