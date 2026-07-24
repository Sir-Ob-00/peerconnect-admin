import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChats, getChatMessages, deleteChatMessage, getFlaggedChats } from '../services/chats';

export function useChats(params?: { search?: string; type?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['adminChats', params],
    queryFn: () => getChats(params),
  });
}

export function useChatMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['chatMessages', conversationId],
    queryFn: () => (conversationId ? getChatMessages(conversationId) : Promise.reject('No Conversation ID')),
    enabled: !!conversationId,
  });
}

export function useDeleteChatMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['flaggedChats'] });
    },
  });
}

export function useFlaggedChats() {
  return useQuery({
    queryKey: ['flaggedChats'],
    queryFn: getFlaggedChats,
  });
}
