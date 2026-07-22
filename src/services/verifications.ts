import { get, patch } from './api';
import type { VerificationItem } from '../types/api';

export async function getPendingVerifications(): Promise<VerificationItem[]> {
  const response = await get<VerificationItem[]>('/admin/verifications', { status: 'pending_approval' });
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
