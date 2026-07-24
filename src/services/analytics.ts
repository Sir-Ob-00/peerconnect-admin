import { get } from './api';
import type { AnalyticsOverview, UserAnalytics, SessionAnalytics, EngagementAnalytics } from '../types/api';

export async function getAnalyticsOverview() {
  const res = await get<AnalyticsOverview>('/admin/analytics/overview');
  return res.data;
}

export async function getUserAnalytics(params?: { startDate?: string; endDate?: string }) {
  const res = await get<UserAnalytics>('/admin/analytics/users', params);
  return res.data;
}

export async function getSessionAnalytics(params?: { startDate?: string; endDate?: string }) {
  const res = await get<SessionAnalytics>('/admin/analytics/sessions', params);
  return res.data;
}

export async function getEngagementAnalytics() {
  const res = await get<EngagementAnalytics>('/admin/analytics/engagement');
  return res.data;
}
