'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Business, BusinessWithRelations } from '@/lib/sdk/types';
import type { PaginatedResult, PaginationMeta } from '@/lib/sdk/types';
import {
  useListBusinesses,
  useCreateBusiness,
  useUpdateBusiness,
  useDeleteBusiness,
  type BusinessesListParams,
} from '@/hooks/api/businesses';

export type BusinessesContextValue = {
  listParams: BusinessesListParams | undefined;
  setListParams: (params: BusinessesListParams | undefined) => void;
  data: PaginatedResult<BusinessWithRelations> | undefined;
  items: BusinessWithRelations[] | undefined;
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  createBusiness: ReturnType<typeof useCreateBusiness>;
  updateBusiness: ReturnType<typeof useUpdateBusiness>;
  deleteBusiness: ReturnType<typeof useDeleteBusiness>;
};

const BusinessesContext = createContext<BusinessesContextValue | null>(null);

export function BusinessesProvider({ children }: { children: ReactNode }) {
  const [listParams, setListParams] = useState<BusinessesListParams | undefined>(undefined);
  const listQuery = useListBusinesses(listParams);
  const createBusiness = useCreateBusiness();
  const updateBusiness = useUpdateBusiness();
  const deleteBusiness = useDeleteBusiness();

  const value = useMemo<BusinessesContextValue>(
    () => ({
      listParams,
      setListParams,
      data: listQuery.data,
      items: listQuery.data?.items,
      meta: listQuery.data?.meta,
      isLoading: listQuery.isLoading,
      isFetching: listQuery.isFetching,
      isPending: listQuery.isPending,
      error: listQuery.error,
      refetch: listQuery.refetch,
      createBusiness,
      updateBusiness,
      deleteBusiness,
    }),
    [
      listParams,
      listQuery.data,
      listQuery.isLoading,
      listQuery.isFetching,
      listQuery.isPending,
      listQuery.error,
      listQuery.refetch,
      createBusiness,
      updateBusiness,
      deleteBusiness,
    ]
  );

  return <BusinessesContext.Provider value={value}>{children}</BusinessesContext.Provider>;
}

export function useBusinesses(): BusinessesContextValue {
  const ctx = useContext(BusinessesContext);
  if (!ctx) {
    throw new Error('useBusinesses debe usarse dentro de BusinessesProvider');
  }
  return ctx;
}

export type { BusinessesListParams };
export { useBusiness } from '@/hooks/api/businesses';
export type { Business, BusinessWithRelations };
