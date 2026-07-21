import { useQuery } from '@tanstack/react-query';
import { getReviews, getReviewsForUser } from '../services/reviews';
import type { ReviewsForUserResponse } from '../types/api';

export function useReviews(params?: {
  reviewerId?: string;
  receiverId?: string;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['reviews', 'list', params],
    queryFn: () => getReviews(params),
  });
}

export function useReviewsForUser(userId: string, params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery<ReviewsForUserResponse>({
    queryKey: ['reviews', 'user', userId, params],
    queryFn: () => getReviewsForUser(userId, params),
    enabled: !!userId,
  });
}
