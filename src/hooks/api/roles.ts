'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { applyListPaginationToSearchParams, DEFAULT_PAGE, LIST_DEFAULT_PAGE_SIZE } from '@/lib/api/pagination';
import { sdkClient } from '@/lib/sdk/client';
import type { ListPaginationParams, PaginatedResult } from '@/lib/sdk/types';

export type RoleOption = { id: string; name: string };

export const rolesKeys = {
  all: ['roles'] as const,
  list: (pagination?: ListPaginationParams) =>
    [
      ...rolesKeys.all,
      'list',
      pagination?.page ?? DEFAULT_PAGE,
      pagination?.pageSize ?? LIST_DEFAULT_PAGE_SIZE,
    ] as const,
  detail: (id: string) => [...rolesKeys.all, 'detail', id] as const,
};

async function fetchRoles(
  pagination?: ListPaginationParams
): Promise<PaginatedResult<RoleOption>> {
  const url = new URL('/api/roles', window.location.origin);
  applyListPaginationToSearchParams(url.searchParams, pagination);
  const { data } = await sdkClient.get<PaginatedResult<RoleOption>>(url.pathname + url.search);
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
  pagination?: ListPaginationParams,
  options?: Omit<UseQueryOptions<PaginatedResult<RoleOption>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: rolesKeys.list(pagination),
    queryFn: () => fetchRoles(pagination),
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
