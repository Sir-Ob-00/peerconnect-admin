import { get, post, patch, del } from './api';
import type { NotificationItem, AnnouncementItem } from '../types/api';

// Admin Push / User Notifications
export async function getAdminNotifications(params?: { search?: string; type?: string; page?: number; limit?: number }) {
  const response = await get<NotificationItem[] | { data: NotificationItem[] }>('/admin/notifications', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: NotificationItem[] }).data)) {
    return (response.data as { data: NotificationItem[] }).data;
  }
  return [];
}

export async function sendNotification(data: { userId?: string; title: string; message: string; type?: string }) {
  const response = await post<NotificationItem>('/admin/notifications', data);
  return response.data;
}

export async function broadcastNotification(data: { title: string; message: string; targetAudience?: string; targetValue?: string }) {
  const response = await post<NotificationItem>('/admin/notifications/broadcast', data);
  return response.data;
}

export async function deleteNotification(id: string) {
  const response = await del(`/admin/notifications/${id}`);
  return response.data;
}

// System Announcements
export async function getAnnouncements(params?: { search?: string; status?: string; page?: number; limit?: number }) {
  const response = await get<AnnouncementItem[] | { data: AnnouncementItem[] }>('/admin/announcements', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: AnnouncementItem[] }).data)) {
    return (response.data as { data: AnnouncementItem[] }).data;
  }
  return [];
}

export async function getAnnouncementById(id: string) {
  const response = await get<AnnouncementItem>(`/admin/announcements/${id}`);
  return response.data;
}

export async function createAnnouncement(data: { title: string; content: string; targetAudience: string; targetValue?: string; status?: string }) {
  const response = await post<AnnouncementItem>('/admin/announcements', data);
  return response.data;
}

export async function updateAnnouncement(id: string, data: Partial<{ title: string; content: string; targetAudience: string; targetValue: string; status: string }>) {
  const response = await patch<AnnouncementItem>(`/admin/announcements/${id}`, data);
  return response.data;
}

export async function deleteAnnouncement(id: string) {
  const response = await del(`/admin/announcements/${id}`);
  return response.data;
}
