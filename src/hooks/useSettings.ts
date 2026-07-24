import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, getSettingByKey, createOrUpdateSetting, deleteSetting, initializeDefaultSettings } from '../services/settings';

export function useSettings(params?: { category?: string }) {
  return useQuery({
    queryKey: ['settings', params],
    queryFn: () => getSettings(params),
  });
}

export function useSettingByKey(key: string) {
  return useQuery({
    queryKey: ['setting', key],
    queryFn: () => getSettingByKey(key),
    enabled: !!key,
  });
}

export function useSaveSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: Parameters<typeof createOrUpdateSetting>[1] }) =>
      createOrUpdateSetting(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['setting'] });
    },
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSetting,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });
}

export function useInitializeSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: initializeDefaultSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });
}
