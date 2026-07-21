import { get, patch, del } from './api';
import type { StudentDetail, StudentsListResponse } from '../types/api';

const BASE = '/admin/students';

export async function getStudents(params?: {
  search?: string;
  role?: string;
  verificationStatus?: string;
  accountStatus?: string;
  page?: number;
  limit?: number;
}): Promise<StudentsListResponse> {
  const response = await get<StudentsListResponse>(BASE, params);
  return response.data;
}

export async function getStudentById(id: string): Promise<StudentDetail> {
  const response = await get<StudentDetail>(`${BASE}/${id}`);
  return response.data;
}

export async function suspendStudent(id: string): Promise<void> {
  await patch(`${BASE}/${id}/suspend`);
}

export async function activateStudent(id: string): Promise<void> {
  await patch(`${BASE}/${id}/activate`);
}

export async function deleteStudent(id: string): Promise<void> {
  await del(`${BASE}/${id}`);
}
