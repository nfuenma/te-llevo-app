'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { sdkClient } from '@/lib/sdk/client';

export type RoleOption = { id: string; name: string };

export const rolesKeys = {
  all: ['roles'] as const,
  list: () => [...rolesKeys.all, 'list'] as const,
  detail: (id: string) => [...rolesKeys.all, 'detail', id] as const,
};

async function fetchRoles(): Promise<RoleOption[]> {
  const { data } = await sdkClient.get<RoleOption[]>('/api/roles');
  return data;
}

async function createRole(payload: { name: string }): Promise<RoleOption> {
  const { data } = await sdkClient.post<RoleOption>('/api/roles', payload);
  return data;
}

async function updateRole(id: string, payload: { name: string }): Promise<RoleOption> {
  const { data } = await sdkClient.put<RoleOption>(`/api/roles/${id}`, payload);
  return data;
}

async function deleteRole(id: string): Promise<void> {
  await sdkClient.delete(`/api/roles/${id}`);
}

export function useListRoles(
  options?: Omit<UseQueryOptions<RoleOption[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: rolesKeys.list(),
    queryFn: fetchRoles,
    ...options,
  });
}

export function useCreateRole(
  options?: UseMutationOptions<RoleOption, Error, { name: string }>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: rolesKeys.all });
    },
    ...options,
  });
}

export function useUpdateRole(
  options?: UseMutationOptions<RoleOption, Error, { id: string; name: string }>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }) => updateRole(id, { name }),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: rolesKeys.detail(variables.id) });
      void qc.invalidateQueries({ queryKey: rolesKeys.all });
    },
    ...options,
  });
}

export function useDeleteRole(options?: UseMutationOptions<void, Error, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: (_, id) => {
      void qc.invalidateQueries({ queryKey: rolesKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: rolesKeys.all });
    },
    ...options,
  });
}
