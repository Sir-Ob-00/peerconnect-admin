import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudyGroups, getStudyGroupById, deleteStudyGroup,
  getStudyGroupMembers, removeStudyGroupMember, getStudyGroupMessages
} from '../services/studyGroups';

export function useStudyGroups(params?: { search?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['studyGroups', params],
    queryFn: () => getStudyGroups(params),
  });
}

export function useStudyGroupDetail(id: string | null) {
  return useQuery({
    queryKey: ['studyGroup', id],
    queryFn: () => (id ? getStudyGroupById(id) : Promise.reject('No ID')),
    enabled: !!id,
  });
}

export function useDeleteStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudyGroup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyGroups'] }),
  });
}

export function useStudyGroupMembers(chatRoomId: string | null) {
  return useQuery({
    queryKey: ['studyGroupMembers', chatRoomId],
    queryFn: () => (chatRoomId ? getStudyGroupMembers(chatRoomId) : Promise.reject('No ChatRoomID')),
    enabled: !!chatRoomId,
  });
}

export function useRemoveStudyGroupMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatRoomId, userId }: { chatRoomId: string; userId: string }) =>
      removeStudyGroupMember(chatRoomId, userId),
    onSuccess: (_, { chatRoomId }) => {
      queryClient.invalidateQueries({ queryKey: ['studyGroupMembers', chatRoomId] });
      queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
    },
  });
}

export function useStudyGroupMessages(chatRoomId: string | null) {
  return useQuery({
    queryKey: ['studyGroupMessages', chatRoomId],
    queryFn: () => (chatRoomId ? getStudyGroupMessages(chatRoomId) : Promise.reject('No ChatRoomID')),
    enabled: !!chatRoomId,
  });
}
