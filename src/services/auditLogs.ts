import { get } from './api';
import type { AuditLogItem } from '../types/api';

export async function getAuditLogs(params?: { search?: string; action?: string; adminId?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) {
  const response = await get<AuditLogItem[] | { data: AuditLogItem[] }>('/admin/audit-logs', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: AuditLogItem[] }).data)) {
    return (response.data as { data: AuditLogItem[] }).data;
  }
  return [];
}

export async function getAuditLogById(id: string) {
  const response = await get<AuditLogItem>(`/admin/audit-logs/${id}`);
  return response.data;
}

export async function getAuditLogStats() {
  const response = await get<{ totalLogs: number; actionsBreakdown: Record<string, number> }>('/admin/audit-logs/stats');
  return response.data;
}
