import { SERVER_HTTP_URL } from '../config/server';
import { AllowPlayerResponse } from '../types/api';

function defaultHeaders(): Headers {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return headers;
}

export async function allowPlayer(
  action: string,
  name: string,
  room: string
): Promise<AllowPlayerResponse> {
  const res = await fetch(`${SERVER_HTTP_URL}/api/game/allow`, {
    method: 'POST',
    body: JSON.stringify({ action, name, room }),
    headers: defaultHeaders(),
  });
  return res.json();
}
