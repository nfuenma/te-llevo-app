'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { sdkClient } from '@/lib/sdk/client';
import type { Business, BusinessWithRelations } from '@/lib/sdk/types';

export const businessesKeys = {
  all: ['businesses'] as const,
  list: (params?: { categoryId?: string }) =>
    [...businessesKeys.all, 'list', params] as const,
  detail: (id: string) => [...businessesKeys.all, 'detail', id] as const,
};

type ListParams = { categoryId?: string };

async function fetchList(params?: ListParams): Promise<BusinessWithRelations[]> {
  const url = new URL('/api/businesses', window.location.origin);
  if (params?.categoryId) url.searchParams.set('categoryId', params.categoryId);
  const { data } = await sdkClient.get<BusinessWithRelations[]>(url.pathname + url.search);
  return data;
}

async function fetchDetail(id: string): Promise<BusinessWithRelations> {
  const { data } = await sdkClient.get<BusinessWithRelations>(`/businesses/${id}`);
  return data;
}

type CreatePayload = {
  name: string;
  slug: string;
  description?: string;
  address?: string;
  image?: string;
  categoryIds?: string[];
};

type UpdatePayload = Partial<CreatePayload>;

async function createBusiness(payload: CreatePayload) {
  const { data } = await sdkClient.post<Business>('/api/businesses', payload);
  return data;
}

async function updateBusiness(id: string, payload: UpdatePayload) {
  const { data } = await sdkClient.put<Business>(`/api/businesses/${id}`, payload);
  return data;
}

async function removeBusiness(id: string) {
  await sdkClient.delete(`/api/businesses/${id}`);
}

export function useListBusinesses(
  params?: ListParams,
  options?: Omit<UseQueryOptions<BusinessWithRelations[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: businessesKeys.list(params),
    queryFn: () => fetchList(params),
    ...options,
  });
}

export function useBusiness(
  id: string | undefined | null,
  options?: Omit<
    UseQueryOptions<BusinessWithRelations | undefined>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: businessesKeys.detail(id ?? ''),
    queryFn: () => fetchDetail(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateBusiness(
  options?: UseMutationOptions<Business, Error, CreatePayload>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBusiness,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: businessesKeys.all });
    },
    ...options,
  });
}

export function useUpdateBusiness(
  options?: UseMutationOptions<Business, Error, { id: string } & UpdatePayload>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateBusiness(id, payload),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: businessesKeys.detail(variables.id) });
      void qc.invalidateQueries({ queryKey: businessesKeys.all });
    },
    ...options,
  });
}

export function useDeleteBusiness(
  options?: UseMutationOptions<void, Error, string>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeBusiness,
    onSuccess: (_, id) => {
      void qc.invalidateQueries({ queryKey: businessesKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: businessesKeys.all });
    },
    ...options,
  });
}
