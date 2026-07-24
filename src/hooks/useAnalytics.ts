import { useQuery } from '@tanstack/react-query';
import { getAnalyticsOverview, getUserAnalytics, getSessionAnalytics, getEngagementAnalytics, getRegistrationsTrend, getUniversityDistribution } from '../services/analytics';

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: getAnalyticsOverview,
  });
}

export function useUserAnalytics(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['userAnalytics', params],
    queryFn: () => getUserAnalytics(params),
  });
}

export function useSessionAnalytics(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['sessionAnalytics', params],
    queryFn: () => getSessionAnalytics(params),
  });
}

export function useEngagementAnalytics() {
  return useQuery({
    queryKey: ['engagementAnalytics'],
    queryFn: getEngagementAnalytics,
  });
}

export function useRegistrationsTrend() {
  return useQuery({
    queryKey: ['registrationsTrend'],
    queryFn: getRegistrationsTrend,
  });
}

export function useUniversityDistribution() {
  return useQuery({
    queryKey: ['universityDistribution'],
    queryFn: getUniversityDistribution,
  });
}
