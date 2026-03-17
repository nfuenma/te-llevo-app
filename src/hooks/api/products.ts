'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { sdkClient } from '@/lib/sdk/client';
import type { Product, ProductWithBusiness } from '@/lib/sdk/types';

export const productsKeys = {
  all: ['products'] as const,
  list: (params?: { businessId?: string; categoryId?: string }) =>
    [...productsKeys.all, 'list', params] as const,
  detail: (id: string) => [...productsKeys.all, 'detail', id] as const,
};

type ListParams = { businessId?: string; categoryId?: string };

async function fetchList(params?: ListParams): Promise<ProductWithBusiness[]> {
  const url = new URL('/api/products', window.location.origin);
  if (params?.businessId) url.searchParams.set('businessId', params.businessId);
  if (params?.categoryId) url.searchParams.set('categoryId', params.categoryId);
  const { data } = await sdkClient.get<ProductWithBusiness[]>(url.pathname + url.search);
  return data;
}

async function fetchDetail(id: string): Promise<ProductWithBusiness> {
  const { data } = await sdkClient.get<ProductWithBusiness>(`/api/products/${id}`);
  return data;
}

type CreatePayload = {
  businessId: string;
  name: string;
  description?: string;
  price?: number | string;
  image?: string;
  categoryIds?: string[];
  productCategoryIds?: string[];
};

type UpdatePayload = {
  name?: string;
  description?: string;
  price?: number | string;
  image?: string;
  categoryIds?: string[];
  productCategoryIds?: string[];
};

async function createProduct(payload: CreatePayload) {
  const { data } = await sdkClient.post<Product>('/api/products', payload);
  return data;
}

async function updateProduct(id: string, payload: UpdatePayload) {
  const { data } = await sdkClient.put<Product>(`/api/products/${id}`, payload);
  return data;
}

async function removeProduct(id: string) {
  await sdkClient.delete(`/api/products/${id}`);
}

export function useListProducts(
  params?: ListParams,
  options?: Omit<UseQueryOptions<ProductWithBusiness[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productsKeys.list(params),
    queryFn: () => fetchList(params),
    ...options,
  });
}

export function useProduct(
  id: string | undefined | null,
  options?: Omit<
    UseQueryOptions<ProductWithBusiness | undefined>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: productsKeys.detail(id ?? ''),
    queryFn: () => fetchDetail(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateProduct(
  options?: UseMutationOptions<Product, Error, CreatePayload>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: productsKeys.all });
    },
    ...options,
  });
}

export function useUpdateProduct(
  options?: UseMutationOptions<Product, Error, { id: string } & UpdatePayload>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateProduct(id, payload),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: productsKeys.detail(variables.id) });
      void qc.invalidateQueries({ queryKey: productsKeys.all });
    },
    ...options,
  });
}

export function useDeleteProduct(
  options?: UseMutationOptions<void, Error, string>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeProduct,
    onSuccess: (_, id) => {
      void qc.invalidateQueries({ queryKey: productsKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: productsKeys.all });
    },
    ...options,
  });
}
