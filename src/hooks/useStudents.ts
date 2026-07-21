import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, getStudentById, suspendStudent, activateStudent, deleteStudent } from '../services/students';
import type { StudentDetail, StudentsListResponse } from '../types/api';

export function useStudents(params?: {
  search?: string;
  role?: string;
  verificationStatus?: string;
  accountStatus?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<StudentsListResponse>({
    queryKey: ['students', 'list', params],
    queryFn: () => getStudents(params),
  });
}

export function useStudentById(id: string) {
  return useQuery<StudentDetail>({
    queryKey: ['students', 'detail', id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });
}

export function useSuspendStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suspendStudent(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useActivateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateStudent(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
