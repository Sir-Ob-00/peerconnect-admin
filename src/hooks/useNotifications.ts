import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminNotifications, sendNotification, broadcastNotification, deleteNotification,
  getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement
} from '../services/notifications';

// Notifications
export function useAdminNotifications(params?: { search?: string; type?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['adminNotifications', params],
    queryFn: () => getAdminNotifications(params),
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotifications'] }),
  });
}

export function useBroadcastNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: broadcastNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotifications'] }),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotifications'] }),
  });
}

// Announcements
export function useAnnouncements(params?: { search?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => getAnnouncements(params),
  });
}

export function useAnnouncementDetail(id: string | null) {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => (id ? getAnnouncementById(id) : Promise.reject('No ID')),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAnnouncement>[1] }) =>
      updateAnnouncement(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  });
}
