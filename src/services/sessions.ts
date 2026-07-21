import { get } from './api';
import type { SessionsListResponse, SessionDetail } from '../types/api';

const BASE = '/admin/sessions';

export async function getSessions(params?: {
  status?: string;
  requesterId?: string;
  receiverId?: string;
  skill?: string;
  page?: number;
  limit?: number;
}): Promise<SessionsListResponse> {
  const response = await get<SessionsListResponse>(BASE, params);
  return response.data;
}

export async function getSessionById(id: string): Promise<SessionDetail> {
  const response = await get<SessionDetail>(`${BASE}/${id}`);
  return response.data;
}
