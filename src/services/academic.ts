import { get, post, patch, del } from './api';
import type { UniversityItem, DepartmentItem, ProgrammeItem, LevelItem } from '../types/api';

// Universities
export async function getUniversities(params?: { search?: string; status?: string; page?: number; limit?: number }) {
  const response = await get<UniversityItem[] | { data: UniversityItem[] }>('/admin/universities', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: UniversityItem[] }).data)) {
    return (response.data as { data: UniversityItem[] }).data;
  }
  return [];
}

export async function createUniversity(data: { name: string; code?: string; location?: string }) {
  const response = await post<UniversityItem>('/admin/universities', data);
  return response.data;
}

export async function updateUniversity(id: string, data: Partial<{ name: string; code: string; location: string; status: string }>) {
  const response = await patch<UniversityItem>(`/admin/universities/${id}`, data);
  return response.data;
}

export async function deleteUniversity(id: string) {
  const response = await del(`/admin/universities/${id}`);
  return response.data;
}

// Departments
export async function getDepartments(params?: { search?: string; universityId?: string; status?: string; page?: number; limit?: number }) {
  const response = await get<DepartmentItem[] | { data: DepartmentItem[] }>('/admin/departments', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: DepartmentItem[] }).data)) {
    return (response.data as { data: DepartmentItem[] }).data;
  }
  return [];
}

export async function createDepartment(data: { name: string; code?: string; universityId: string }) {
  const response = await post<DepartmentItem>('/admin/departments', data);
  return response.data;
}

export async function updateDepartment(id: string, data: Partial<{ name: string; code: string; universityId: string; status: string }>) {
  const response = await patch<DepartmentItem>(`/admin/departments/${id}`, data);
  return response.data;
}

export async function deleteDepartment(id: string) {
  const response = await del(`/admin/departments/${id}`);
  return response.data;
}

// Programmes
export async function getProgrammes(params?: { search?: string; departmentId?: string; status?: string; page?: number; limit?: number }) {
  const response = await get<ProgrammeItem[] | { data: ProgrammeItem[] }>('/admin/programmes', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: ProgrammeItem[] }).data)) {
    return (response.data as { data: ProgrammeItem[] }).data;
  }
  return [];
}

export async function createProgramme(data: { name: string; code?: string; departmentId: string; durationYears?: number }) {
  const response = await post<ProgrammeItem>('/admin/programmes', data);
  return response.data;
}

export async function updateProgramme(id: string, data: Partial<{ name: string; code: string; departmentId: string; durationYears: number; status: string }>) {
  const response = await patch<ProgrammeItem>(`/admin/programmes/${id}`, data);
  return response.data;
}

export async function deleteProgramme(id: string) {
  const response = await del(`/admin/programmes/${id}`);
  return response.data;
}

// Levels
export async function getLevels(params?: { search?: string; status?: string }) {
  const response = await get<LevelItem[] | { data: LevelItem[] }>('/admin/levels', params);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray((response.data as { data: LevelItem[] }).data)) {
    return (response.data as { data: LevelItem[] }).data;
  }
  return [];
}

export async function createLevel(data: { name: string; code: string; sortOrder?: number }) {
  const response = await post<LevelItem>('/admin/levels', data);
  return response.data;
}

export async function updateLevel(id: string, data: Partial<{ name: string; code: string; sortOrder: number; status: string }>) {
  const response = await patch<LevelItem>(`/admin/levels/${id}`, data);
  return response.data;
}

export async function deleteLevel(id: string) {
  const response = await del(`/admin/levels/${id}`);
  return response.data;
}

export async function reorderLevels(levels: Array<{ id: string; sortOrder: number }>) {
  const response = await patch<LevelItem[]>('/admin/levels/reorder', { levels });
  return response.data;
}
