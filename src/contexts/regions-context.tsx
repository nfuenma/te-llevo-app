'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { keepPreviousData } from '@tanstack/react-query';
import type { Region, RegionWithCategories, PaginatedResult, PaginationMeta } from '@/lib/sdk/types';
import {
  useListRegions,
  useCreateRegion,
  useUpdateRegion,
  useDeleteRegion,
  type ListRegionsParams,
} from '@/hooks/api/regions';

export type RegionsContextValue = {
  listParams: ListRegionsParams | undefined;
  setListParams: (params: ListRegionsParams | undefined) => void;
  data: PaginatedResult<RegionWithCategories> | undefined;
  items: RegionWithCategories[] | undefined;
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  createRegion: ReturnType<typeof useCreateRegion>;
  updateRegion: ReturnType<typeof useUpdateRegion>;
  deleteRegion: ReturnType<typeof useDeleteRegion>;
};

const RegionsContext = createContext<RegionsContextValue | null>(null);

export function RegionsProvider({ children }: { children: ReactNode }) {
  const [listParams, setListParams] = useState<ListRegionsParams | undefined>(undefined);
  const listQuery = useListRegions(listParams, { placeholderData: keepPreviousData });
  const createRegion = useCreateRegion();
  const updateRegion = useUpdateRegion();
  const deleteRegion = useDeleteRegion();

  const value = useMemo<RegionsContextValue>(
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
      createRegion,
      updateRegion,
      deleteRegion,
    }),
    [
      listParams,
      listQuery.data,
      listQuery.isLoading,
      listQuery.isFetching,
      listQuery.isPending,
      listQuery.error,
      listQuery.refetch,
      createRegion,
      updateRegion,
      deleteRegion,
    ]
  );

  return <RegionsContext.Provider value={value}>{children}</RegionsContext.Provider>;
}

export function useRegions(): RegionsContextValue {
  const ctx = useContext(RegionsContext);
  if (!ctx) {
    throw new Error('useRegions debe usarse dentro de RegionsProvider');
  }
  return ctx;
}

export type { ListRegionsParams };
export { useRegion } from '@/hooks/api/regions';
export type { Region, RegionWithCategories };
