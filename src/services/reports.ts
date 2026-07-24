import { get, post, patch, del } from './api';
import type { ReportItem } from '../types/api';

export async function getReports(params?: { search?: string; status?: string; targetType?: string; page?: number; limit?: number }) {
  const response = await get<ReportItem[] | { data: ReportItem[] }>('/admin/reports', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: ReportItem[] }).data)) {
    return (response.data as { data: ReportItem[] }).data;
  }
  return [];
}

export async function getReportById(id: string) {
  const response = await get<ReportItem>(`/admin/reports/${id}`);
  return response.data;
}

export async function createReport(data: { reportedUserId: string; targetType: string; targetId: string; reason: string; details?: string }) {
  const response = await post<ReportItem>('/admin/reports', data);
  return response.data;
}

export async function updateReportStatus(id: string, data: { status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'; adminNotes?: string }) {
  const response = await patch<ReportItem>(`/admin/reports/${id}/status`, data);
  return response.data;
}

export async function deleteReport(id: string) {
  const response = await del(`/admin/reports/${id}`);
  return response.data;
}
