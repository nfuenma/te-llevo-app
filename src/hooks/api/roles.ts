'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { sdkClient } from '@/lib/sdk/client';

export type RoleOption = { id: string; name: string };

export const rolesKeys = {
  all: ['roles'] as const,
  list: () => [...rolesKeys.all, 'list'] as const,
};

async function fetchRoles(): Promise<RoleOption[]> {
  const { data } = await sdkClient.get<RoleOption[]>('/api/roles');
  return data;
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
