'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { sdkClient } from '@/lib/sdk/client';
import type { Category, CategoryWithCount } from '@/lib/sdk/types';

export const categoriesKeys = {
  all: ['categories'] as const,
  list: (params?: { categoryId?: string }) =>
    [...categoriesKeys.all, 'list', params] as const,
  detail: (id: string) => [...categoriesKeys.all, 'detail', id] as const,
};

async function fetchList(): Promise<CategoryWithCount[]> {
  const { data } = await sdkClient.get<CategoryWithCount[]>('/api/categories');
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
  options?: Omit<UseQueryOptions<CategoryWithCount[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: fetchList,
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
