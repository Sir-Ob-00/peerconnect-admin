import { useQuery } from '@tanstack/react-query';
import { getSessions, getSessionById } from '../services/sessions';
import type { SessionDetail } from '../types/api';

export function useSessions(params?: {
  status?: string;
  requesterId?: string;
  receiverId?: string;
  skill?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['sessions', 'list', params],
    queryFn: () => getSessions(params),
  });
}

export function useSessionById(id: string) {
  return useQuery<SessionDetail>({
    queryKey: ['sessions', 'detail', id],
    queryFn: () => getSessionById(id),
    enabled: !!id,
  });
}
