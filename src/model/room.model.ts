export interface RoomResponse {
  roomId: number;
  name: string;
  location: string,
  capacity: number
}
export interface RoomRequest {
  name: string;
  location: string,
  capacity: number
}
export interface RoomWithStatus {
  roomId: number;
  name: string;
  location: string,
  capacity: number,
  status: string
}
