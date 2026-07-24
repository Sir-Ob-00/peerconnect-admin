import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, getReportById, createReport, updateReportStatus, deleteReport } from '../services/reports';

export function useReports(params?: { search?: string; status?: string; targetType?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => getReports(params),
  });
}

export function useReportDetail(id: string | null) {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => (id ? getReportById(id) : Promise.reject('No ID')),
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateReportStatus>[1] }) =>
      updateReportStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}
