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
import type { ListPaginationParams, PaginatedResult, UserWithRolesAndBusinesses } from '@/lib/sdk/types';

export const usersKeys = {
  all: ['users'] as const,
  list: (pagination?: ListPaginationParams) =>
    [
      ...usersKeys.all,
      'list',
      pagination?.page ?? DEFAULT_PAGE,
      pagination?.pageSize ?? LIST_DEFAULT_PAGE_SIZE,
    ] as const,
  detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
};

type UpdatePayload = { roleIds: string[]; businessIds: string[] };

async function fetchList(
  pagination?: ListPaginationParams
): Promise<PaginatedResult<UserWithRolesAndBusinesses>> {
  const url = new URL('/api/users', window.location.origin);
  applyListPaginationToSearchParams(url.searchParams, pagination);
  const { data } = await sdkClient.get<PaginatedResult<UserWithRolesAndBusinesses>>(
    url.pathname + url.search
  );
  return data;
}

async function fetchDetail(id: string): Promise<UserWithRolesAndBusinesses> {
  const { data } = await sdkClient.get<UserWithRolesAndBusinesses>(`/api/users/${id}`);
  return data;
}

async function updateUser(id: string, payload: UpdatePayload) {
  const { data } = await sdkClient.put<UserWithRolesAndBusinesses>(`/api/users/${id}`, payload);
  return data;
}

export function useListUsers(
  pagination?: ListPaginationParams,
  options?: Omit<
    UseQueryOptions<PaginatedResult<UserWithRolesAndBusinesses>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: usersKeys.list(pagination),
    queryFn: () => fetchList(pagination),
    ...options,
  });
}

export function useUser(
  id: string | undefined | null,
  options?: Omit<
    UseQueryOptions<UserWithRolesAndBusinesses | undefined>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: usersKeys.detail(id ?? ''),
    queryFn: () => fetchDetail(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useUpdateUser(
  options?: UseMutationOptions<
    UserWithRolesAndBusinesses,
    Error,
    { id: string } & UpdatePayload
  >
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateUser(id, payload),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: usersKeys.detail(variables.id) });
      void qc.invalidateQueries({ queryKey: usersKeys.all });
    },
    ...options,
  });
}
