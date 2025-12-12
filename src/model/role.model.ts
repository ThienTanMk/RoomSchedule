export enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER'
}

export interface AssignRoleRequest {
  roleName: RoleType;
}

export interface RoleRepresentation {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
}
