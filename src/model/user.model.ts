export interface UserResponse {
  userId: number;
  keycloakId: string;
  username: string;
  firstname: string;
  lastname: string;
  dob: string;
  email: string;
  department: DepartmentResponse;
}

export interface DepartmentResponse {
  departmentId: string;
  name: string;
}

export interface UserCreationRequest {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  dob: string;
  departmentId?: number;
  email: string;
}


export interface UserUpdateRequest {
  firstname: string;
  lastname: string;
  dob: string;
  departmentId?: number;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}


export interface CurrentUser extends UserResponse {
  roles: string[];
}
