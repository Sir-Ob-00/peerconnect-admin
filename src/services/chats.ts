import { get, del } from './api';
import type { ChatConversationItem, ChatMessageItem } from '../types/api';

export async function getChats(params?: { search?: string; type?: string; page?: number; limit?: number }) {
  const response = await get<ChatConversationItem[] | { data: ChatConversationItem[] }>('/admin/chats', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: ChatConversationItem[] }).data)) {
    return (response.data as { data: ChatConversationItem[] }).data;
  }
  return [];
}

export async function getChatMessages(conversationId: string) {
  const response = await get<ChatMessageItem[] | { data: ChatMessageItem[] }>(`/admin/chats/${conversationId}/messages`);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: ChatMessageItem[] }).data)) {
    return (response.data as { data: ChatMessageItem[] }).data;
  }
  return [];
}

export async function deleteChatMessage(id: string) {
  const response = await del(`/admin/chats/messages/${id}`);
  return response.data;
}

export async function getFlaggedChats() {
  const response = await get<ChatMessageItem[] | { data: ChatMessageItem[] }>('/admin/chats/flagged');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: ChatMessageItem[] }).data)) {
    return (response.data as { data: ChatMessageItem[] }).data;
  }
  return [];
}
