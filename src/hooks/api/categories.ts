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
import type { Category, CategoryWithCount, ListPaginationParams, PaginatedResult } from '@/lib/sdk/types';

export const categoriesKeys = {
  all: ['categories'] as const,
  list: (pagination?: ListPaginationParams) =>
    [
      ...categoriesKeys.all,
      'list',
      pagination?.page ?? DEFAULT_PAGE,
      pagination?.pageSize ?? LIST_DEFAULT_PAGE_SIZE,
    ] as const,
  detail: (id: string) => [...categoriesKeys.all, 'detail', id] as const,
};

async function fetchList(
  pagination?: ListPaginationParams
): Promise<PaginatedResult<CategoryWithCount>> {
  const url = new URL('/api/categories', window.location.origin);
  applyListPaginationToSearchParams(url.searchParams, pagination);
  const { data } = await sdkClient.get<PaginatedResult<CategoryWithCount>>(
    url.pathname + url.search
  );
  return data;
}

async function fetchDetail(id: string): Promise<CategoryWithCount> {
  const { data } = await sdkClient.get<CategoryWithCount>(`/api/categories/${id}`);
  return data;
}

async function create(payload: { name: string; tags?: string[]; image?: string }) {
  const { data } = await sdkClient.post<Category>('/api/categories', payload);
  return data;
}

async function update(
  id: string,
  payload: { name?: string; tags?: string[]; image?: string }
) {
  const { data } = await sdkClient.put<Category>(`/api/categories/${id}`, payload);
  return data;
}

async function remove(id: string) {
  await sdkClient.delete(`/api/categories/${id}`);
}

export function useListCategories(
  pagination?: ListPaginationParams,
  options?: Omit<
    UseQueryOptions<PaginatedResult<CategoryWithCount>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: categoriesKeys.list(pagination),
    queryFn: () => fetchList(pagination),
    ...options,
  });
}

export function useCategory(
  id: string | undefined | null,
  options?: Omit<
    UseQueryOptions<CategoryWithCount | undefined>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: categoriesKeys.detail(id ?? ''),
    queryFn: () => fetchDetail(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateCategory(
  options?: UseMutationOptions<Category, Error, { name: string; tags?: string[]; image?: string }>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: categoriesKeys.all });
    },
    ...options,
  });
}

export function useUpdateCategory(
  options?: UseMutationOptions<
    Category,
    Error,
    { id: string; name?: string; tags?: string[]; image?: string }
  >
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => update(id, payload),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: categoriesKeys.detail(variables.id) });
      void qc.invalidateQueries({ queryKey: categoriesKeys.all });
    },
    ...options,
  });
}

export function useDeleteCategory(options?: UseMutationOptions<void, Error, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: remove,
    onSuccess: (_, id) => {
      void qc.invalidateQueries({ queryKey: categoriesKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: categoriesKeys.all });
    },
    ...options,
  });
}
