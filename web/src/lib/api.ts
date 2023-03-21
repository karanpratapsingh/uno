import { SERVER_HTTP_URL } from '../config';
import { RoomExistsResponse } from '../types/api';

export async function roomExists(room: string): Promise<boolean> {
  const res: RoomExistsResponse = await (
    await fetch(`${SERVER_HTTP_URL}/api/room/${room}`)
  ).json();
  return res.exists;
}
