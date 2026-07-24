import { get, patch, del, post } from './api';
import type { SystemSetting } from '../types/api';

export async function getSettings(params?: { category?: string }) {
  return get<SystemSetting[]>('/admin/settings', params);
}

export async function getSettingByKey(key: string) {
  return get<SystemSetting>(`/admin/settings/${key}`);
}

export async function createOrUpdateSetting(key: string, data: { value: unknown; description?: string; category?: string }) {
  return patch<SystemSetting>(`/admin/settings/${key}`, data);
}

export async function deleteSetting(key: string) {
  return del(`/admin/settings/${key}`);
}

export async function initializeDefaultSettings() {
  return post<SystemSetting[]>('/admin/settings/initialize');
}
