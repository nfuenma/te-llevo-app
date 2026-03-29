'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Category, CategoryWithCount } from '@/lib/sdk/types';
import type { ListPaginationParams, PaginatedResult, PaginationMeta } from '@/lib/sdk/types';
import {
  useListCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/api/categories';

export type CategoriesContextValue = {
  listParams: ListPaginationParams | undefined;
  setListParams: (params: ListPaginationParams | undefined) => void;
  data: PaginatedResult<CategoryWithCount> | undefined;
  items: CategoryWithCount[] | undefined;
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  createCategory: ReturnType<typeof useCreateCategory>;
  updateCategory: ReturnType<typeof useUpdateCategory>;
  deleteCategory: ReturnType<typeof useDeleteCategory>;
};

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [listParams, setListParams] = useState<ListPaginationParams | undefined>(undefined);
  const listQuery = useListCategories(listParams);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const value = useMemo<CategoriesContextValue>(
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
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      listParams,
      listQuery.data,
      listQuery.isLoading,
      listQuery.isFetching,
      listQuery.isPending,
      listQuery.error,
      listQuery.refetch,
      createCategory,
      updateCategory,
      deleteCategory,
    ]
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories(): CategoriesContextValue {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories debe usarse dentro de CategoriesProvider');
  }
  return ctx;
}

export { useCategory } from '@/hooks/api/categories';
export type { Category, CategoryWithCount };
