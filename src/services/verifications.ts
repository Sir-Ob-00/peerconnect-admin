import { get, patch } from './api';
import type { VerificationItem } from '../types/api';

export async function getPendingVerifications(): Promise<VerificationItem[]> {
  const response = await get<VerificationItem[]>('/admin/verifications', { status: 'pending' });
  return response.data;
}

export async function approveVerification(userId: string): Promise<void> {
  await patch(`/admin/verifications/${userId}/approve`);
}

export async function rejectVerification(userId: string, reason?: string): Promise<void> {
  await patch(`/admin/verifications/${userId}/reject`, { reason });
}
