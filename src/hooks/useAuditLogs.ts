import { useQuery } from '@tanstack/react-query';
import { getAuditLogs, getAuditLogById, getAuditLogStats } from '../services/auditLogs';

export function useAuditLogs(params?: { search?: string; action?: string; adminId?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['auditLogs', params],
    queryFn: () => getAuditLogs(params),
  });
}

export function useAuditLogDetail(id: string | null) {
  return useQuery({
    queryKey: ['auditLog', id],
    queryFn: () => (id ? getAuditLogById(id) : Promise.reject('No ID')),
    enabled: !!id,
  });
}

export function useAuditLogStats() {
  return useQuery({
    queryKey: ['auditLogStats'],
    queryFn: getAuditLogStats,
  });
}
