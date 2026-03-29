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
import type { ListPaginationParams, PaginatedResult, Region, RegionWithCategories } from '@/lib/sdk/types';

export type ListRegionsParams = ListPaginationParams & { q?: string };

export const regionsKeys = {
  all: ['regions'] as const,
  list: (params?: ListRegionsParams) =>
    [
      ...regionsKeys.all,
      'list',
      params?.page ?? DEFAULT_PAGE,
      params?.pageSize ?? LIST_DEFAULT_PAGE_SIZE,
      params?.q?.trim() ?? '',
    ] as const,
  detail: (id: string) => [...regionsKeys.all, 'detail', id] as const,
};

async function fetchList(
  params?: ListRegionsParams
): Promise<PaginatedResult<RegionWithCategories>> {
  const url = new URL('/api/regions', window.location.origin);
  applyListPaginationToSearchParams(url.searchParams, params);
  const t = params?.q?.trim();
  if (t) url.searchParams.set('q', t);
  const { data } = await sdkClient.get<PaginatedResult<RegionWithCategories>>(
    url.pathname + url.search
  );
  return data;
}

async function fetchDetail(id: string): Promise<RegionWithCategories> {
  const { data } = await sdkClient.get<RegionWithCategories>(`/api/regions/${id}`);
  return data;
}

type CreatePayload = { name: string; image?: string; categoryIds?: string[] };
type UpdatePayload = { name?: string; image?: string; categoryIds?: string[] };

async function createRegion(payload: CreatePayload) {
  const { data } = await sdkClient.post<Region>('/api/regions', payload);
  return data;
}

async function updateRegion(id: string, payload: UpdatePayload) {
  const { data } = await sdkClient.put<Region>(`/api/regions/${id}`, payload);
  return data;
}

async function removeRegion(id: string) {
  await sdkClient.delete(`/api/regions/${id}`);
}

export function useListRegions(
  params?: ListRegionsParams,
  options?: Omit<
    UseQueryOptions<PaginatedResult<RegionWithCategories>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: regionsKeys.list(params),
    queryFn: () => fetchList(params),
    ...options,
  });
}

export function useRegion(
  id: string | undefined | null,
  options?: Omit<
    UseQueryOptions<RegionWithCategories | undefined>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: regionsKeys.detail(id ?? ''),
    queryFn: () => fetchDetail(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateRegion(
  options?: UseMutationOptions<Region, Error, CreatePayload>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRegion,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: regionsKeys.all });
    },
    ...options,
  });
}

export function useUpdateRegion(
  options?: UseMutationOptions<Region, Error, { id: string } & UpdatePayload>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateRegion(id, payload),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: regionsKeys.detail(variables.id) });
      void qc.invalidateQueries({ queryKey: regionsKeys.all });
    },
    ...options,
  });
}

export function useDeleteRegion(
  options?: UseMutationOptions<void, Error, string>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeRegion,
    onSuccess: (_, id) => {
      void qc.invalidateQueries({ queryKey: regionsKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: regionsKeys.all });
    },
    ...options,
  });
}
