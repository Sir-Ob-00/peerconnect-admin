import { get } from './api';
import type { ReviewsListResponse, ReviewsForUserResponse } from '../types/api';

const BASE = '/admin/reviews';

export async function getReviews(params?: {
  reviewerId?: string;
  receiverId?: string;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
}): Promise<ReviewsListResponse> {
  const response = await get<ReviewsListResponse>(BASE, params);
  return response.data;
}

export async function getReviewsForUser(userId: string, params?: {
  page?: number;
  limit?: number;
}): Promise<ReviewsForUserResponse> {
  const response = await get<ReviewsForUserResponse>(`${BASE}/${userId}`, params);
  return response.data;
}
