import { RoomResponse } from "./room.model";
import { UserResponse } from "./user.model";

export enum ScheduleType{
  ONLINE,
  OFFLINE,
}
export interface ScheduleCreationRequest {
  title: string;
  type: ScheduleType;
  startTime: Date;
  endTime: Date;
  roomId: number;
  participantIds: string[];
}

export interface ScheduleResponse {
  scheduleId: number;
  title: string;
  type: ScheduleType;
  startTime: Date;
  endTime: Date;
  room: RoomResponse;
  participants: UserResponse[];
  isRead?: boolean;
  formattedDate?: string;
  formattedTime?: string;
}

export interface ScheduleUpdateRequest {
  title: string;
  type: ScheduleType;
  startTime: Date;
  endTime: Date;
  roomId: number;
  participantIds: string[];
}

export interface ScheduleByDepartmentRequest {
  title: string;
  type: ScheduleType;
  startTime: Date;
  endTime: Date;
  roomName: string;
}
