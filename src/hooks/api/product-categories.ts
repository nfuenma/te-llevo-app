'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { sdkClient } from '@/lib/sdk/client';
import type { ProductCategory } from '@/lib/sdk/types';

export const productCategoriesKeys = {
  all: ['product-categories'] as const,
  list: (businessId: string) =>
    [...productCategoriesKeys.all, 'list', businessId] as const,
  detail: (id: string) => [...productCategoriesKeys.all, 'detail', id] as const,
};

async function fetchList(businessId: string): Promise<ProductCategory[]> {
  const { data } = await sdkClient.get<ProductCategory[]>(
    `/api/product-categories?businessId=${encodeURIComponent(businessId)}`
  );
  return data;
}

async function fetchDetail(id: string): Promise<ProductCategory> {
  const { data } = await sdkClient.get<ProductCategory>(
    `/api/product-categories/${id}`
  );
  return data;
}

type CreatePayload = { businessId: string; name: string; image?: string };
type UpdatePayload = { name?: string; image?: string };

async function createProductCategory(payload: CreatePayload) {
  const { data } = await sdkClient.post<ProductCategory>(
    '/api/product-categories',
    payload
  );
  return data;
}

async function updateProductCategory(id: string, payload: UpdatePayload) {
  const { data } = await sdkClient.put<ProductCategory>(
    `/api/product-categories/${id}`,
    payload
  );
  return data;
}

async function removeProductCategory(id: string) {
  await sdkClient.delete(`/api/product-categories/${id}`);
}

export function useListProductCategories(
  businessId: string | undefined | null,
  options?: Omit<
    UseQueryOptions<ProductCategory[]>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: productCategoriesKeys.list(businessId ?? ''),
    queryFn: () => fetchList(businessId!),
    enabled: Boolean(businessId),
    ...options,
  });
}

export function useProductCategory(
  id: string | undefined | null,
  options?: Omit<
    UseQueryOptions<ProductCategory | undefined>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: productCategoriesKeys.detail(id ?? ''),
    queryFn: () => fetchDetail(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateProductCategory(
  options?: UseMutationOptions<ProductCategory, Error, CreatePayload>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProductCategory,
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({
        queryKey: productCategoriesKeys.list(variables.businessId),
      });
      void qc.invalidateQueries({ queryKey: productCategoriesKeys.all });
    },
    ...options,
  });
}

export function useUpdateProductCategory(
  options?: UseMutationOptions<
    ProductCategory,
    Error,
    { id: string } & UpdatePayload
  >
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateProductCategory(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: productCategoriesKeys.all });
    },
    ...options,
  });
}

export function useDeleteProductCategory(
  options?: UseMutationOptions<void, Error, string>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeProductCategory,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: productCategoriesKeys.all });
    },
    ...options,
  });
}
