'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { sdkClient } from '@/lib/sdk/client';
import type { UserWithRolesAndBusinesses } from '@/lib/sdk/types';

export const usersKeys = {
  all: ['users'] as const,
  list: () => [...usersKeys.all, 'list'] as const,
  detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
};

type UpdatePayload = { roleIds: string[]; businessIds: string[] };

async function fetchList(): Promise<UserWithRolesAndBusinesses[]> {
  const { data } = await sdkClient.get<UserWithRolesAndBusinesses[]>('/api/users');
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
  options?: Omit<UseQueryOptions<UserWithRolesAndBusinesses[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: fetchList,
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
