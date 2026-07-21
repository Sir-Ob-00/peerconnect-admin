import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingVerifications, approveVerification, rejectVerification } from '../services/verifications';

export function usePendingVerifications() {
  return useQuery({
    queryKey: ['verifications', 'pending'],
    queryFn: getPendingVerifications,
  });
}

export function useApproveVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => approveVerification(userId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
    },
  });
}

export function useRejectVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
      rejectVerification(userId, reason),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
    },
  });
}
