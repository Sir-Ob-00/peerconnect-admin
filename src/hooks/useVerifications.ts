import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingVerifications, getVerificationDetail, approveVerification, rejectVerification, inReviewVerification } from '../services/verifications';
import type { VerificationDetailResponse } from '../types/api';

export function usePendingVerifications() {
  return useQuery({
    queryKey: ['verifications', 'pending'],
    queryFn: getPendingVerifications,
  });
}

export function useVerificationDetail(userId: string) {
  return useQuery<VerificationDetailResponse>({
    queryKey: ['verifications', 'detail', userId],
    queryFn: () => getVerificationDetail(userId),
    enabled: !!userId,
  });
}

function invalidateVerificationRelatedQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['verifications'] });
  queryClient.invalidateQueries({ queryKey: ['stats'] });
}

export function useApproveVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      approveVerification(userId, notes),
    onSettled: () => {
      invalidateVerificationRelatedQueries(queryClient);
    },
  });
}

export function useRejectVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      rejectVerification(userId, notes),
    onSettled: () => {
      invalidateVerificationRelatedQueries(queryClient);
    },
  });
}

export function useInReviewVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      inReviewVerification(userId, notes),
    onSettled: () => {
      invalidateVerificationRelatedQueries(queryClient);
    },
  });
}
