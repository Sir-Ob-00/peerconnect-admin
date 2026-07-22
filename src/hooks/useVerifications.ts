import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingVerifications, approveVerification, rejectVerification, inReviewVerification } from '../services/verifications';

export function usePendingVerifications() {
  return useQuery({
    queryKey: ['verifications', 'pending'],
    queryFn: getPendingVerifications,
  });
}

export function useApproveVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      approveVerification(userId, notes),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
    },
  });
}

export function useRejectVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      rejectVerification(userId, notes),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
    },
  });
}

export function useInReviewVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      inReviewVerification(userId, notes),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
    },
  });
}
