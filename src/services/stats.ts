import { get } from './api';
import type { StatsResponseData } from '../types/api';

export async function getStats(): Promise<StatsResponseData> {
  const response = await get<StatsResponseData>('/admin/stats');
  return response.data;
}
