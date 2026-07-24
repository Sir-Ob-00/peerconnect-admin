import { get, del } from './api';
import type { StudyGroupItem, StudyGroupMember, ChatMessageItem } from '../types/api';

export async function getStudyGroups(params?: { search?: string; status?: string; page?: number; limit?: number }) {
  const response = await get<StudyGroupItem[] | { data: StudyGroupItem[] }>('/admin/study-groups', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: StudyGroupItem[] }).data)) {
    return (response.data as { data: StudyGroupItem[] }).data;
  }
  return [];
}

export async function getStudyGroupById(id: string) {
  const response = await get<StudyGroupItem>(`/admin/study-groups/${id}`);
  return response.data;
}

export async function deleteStudyGroup(id: string) {
  const response = await del(`/admin/study-groups/${id}`);
  return response.data;
}

export async function getStudyGroupMembers(chatRoomId: string) {
  const response = await get<StudyGroupMember[] | { data: StudyGroupMember[] }>(`/admin/study-groups/${chatRoomId}/members`);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: StudyGroupMember[] }).data)) {
    return (response.data as { data: StudyGroupMember[] }).data;
  }
  return [];
}

export async function removeStudyGroupMember(chatRoomId: string, userId: string) {
  const response = await del(`/admin/study-groups/${chatRoomId}/members/${userId}`);
  return response.data;
}

export async function getStudyGroupMessages(chatRoomId: string) {
  const response = await get<ChatMessageItem[] | { data: ChatMessageItem[] }>(`/admin/study-groups/${chatRoomId}/messages`);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: ChatMessageItem[] }).data)) {
    return (response.data as { data: ChatMessageItem[] }).data;
  }
  return [];
}
