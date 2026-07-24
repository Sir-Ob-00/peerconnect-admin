import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUniversities, createUniversity, updateUniversity, deleteUniversity,
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getProgrammes, createProgramme, updateProgramme, deleteProgramme,
  getLevels, createLevel, updateLevel, deleteLevel, reorderLevels
} from '../services/academic';

// Universities Hooks
export function useUniversities(params?: { search?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['universities', params],
    queryFn: () => getUniversities(params),
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUniversity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['universities'] }),
  });
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateUniversity>[1] }) =>
      updateUniversity(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['universities'] }),
  });
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUniversity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['universities'] }),
  });
}

// Departments Hooks
export function useDepartments(params?: { search?: string; universityId?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => getDepartments(params),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateDepartment>[1] }) =>
      updateDepartment(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

// Programmes Hooks
export function useProgrammes(params?: { search?: string; departmentId?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['programmes', params],
    queryFn: () => getProgrammes(params),
  });
}

export function useCreateProgramme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProgramme,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programmes'] }),
  });
}

export function useUpdateProgramme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateProgramme>[1] }) =>
      updateProgramme(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programmes'] }),
  });
}

export function useDeleteProgramme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProgramme,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programmes'] }),
  });
}

// Levels Hooks
export function useLevels(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ['levels', params],
    queryFn: () => getLevels(params),
  });
}

export function useCreateLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLevel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['levels'] }),
  });
}

export function useUpdateLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateLevel>[1] }) =>
      updateLevel(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['levels'] }),
  });
}

export function useDeleteLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLevel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['levels'] }),
  });
}

export function useReorderLevels() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderLevels,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['levels'] }),
  });
}
