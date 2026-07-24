import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../services/admins';

export function useAdmins(params?: { search?: string; role?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: () => getAdmins(params),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admins'] }),
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdmin>[1] }) =>
      updateAdmin(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admins'] }),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admins'] }),
  });
}
