import { get, patch } from './api';
import type { VerificationItem, VerificationDetailResponse } from '../types/api';

export async function getPendingVerifications(): Promise<VerificationItem[]> {
  const response = await get<VerificationItem[] | { data: VerificationItem[] }>('/admin/verifications', { status: 'pending_approval' });
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: VerificationItem[] }).data)) {
    return (response.data as { data: VerificationItem[] }).data;
  }
  return [];
}

export async function getVerificationDetail(userId: string): Promise<VerificationDetailResponse> {
  const response = await get<VerificationDetailResponse>(`/admin/verifications/${userId}`);
  return response.data;
}

export async function approveVerification(userId: string, notes?: string): Promise<void> {
  await patch(`/admin/verifications/${userId}/approve`, { notes: notes ?? '' });
}

export async function rejectVerification(userId: string, notes?: string): Promise<void> {
  await patch(`/admin/verifications/${userId}/reject`, { notes: notes ?? '' });
}

export async function inReviewVerification(userId: string, notes?: string): Promise<void> {
  await patch(`/admin/verifications/${userId}/in-review`, { notes: notes ?? '' });
}
