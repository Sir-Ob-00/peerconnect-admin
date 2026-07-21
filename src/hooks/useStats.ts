import { useQuery } from '@tanstack/react-query';
import { getStats } from '../services/stats';
import type { StatsResponseData } from '../types/api';

export function useStats() {
  return useQuery<StatsResponseData>({
    queryKey: ['stats'],
    queryFn: getStats,
  });
}
