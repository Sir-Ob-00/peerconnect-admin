import { get, post, patch, del } from './api';
import type { AdminUser } from '../types/api';

export async function getAdmins(params?: { search?: string; role?: string; page?: number; limit?: number }) {
  const response = await get<AdminUser[] | { data: AdminUser[] }>('/admin/admins', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: AdminUser[] }).data)) {
    return (response.data as { data: AdminUser[] }).data;
  }
  return [];
}

export async function createAdmin(data: { firstName: string; lastName: string; email: string; password?: string; role: string }) {
  const response = await post<AdminUser>('/admin/admins', data);
  return response.data;
}

export async function updateAdmin(id: string, data: Partial<{ firstName: string; lastName: string; role: string; accountStatus: string }>) {
  const response = await patch<AdminUser>(`/admin/admins/${id}`, data);
  return response.data;
}

export async function deleteAdmin(id: string) {
  const response = await del(`/admin/admins/${id}`);
  return response.data;
}
