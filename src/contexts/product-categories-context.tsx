'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ProductCategory } from '@/lib/sdk/types';
import type { ListPaginationParams, PaginatedResult, PaginationMeta } from '@/lib/sdk/types';
import {
  useListProductCategories,
  useCreateProductCategory,
  useUpdateProductCategory,
  useDeleteProductCategory,
} from '@/hooks/api/product-categories';

export type ProductCategoriesContextValue = {
  listBusinessId: string | null;
  setListBusinessId: (id: string | null) => void;
  listPagination: ListPaginationParams | undefined;
  setListPagination: (p: ListPaginationParams | undefined) => void;
  data: PaginatedResult<ProductCategory> | undefined;
  items: ProductCategory[] | undefined;
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  createProductCategory: ReturnType<typeof useCreateProductCategory>;
  updateProductCategory: ReturnType<typeof useUpdateProductCategory>;
  deleteProductCategory: ReturnType<typeof useDeleteProductCategory>;
};

const ProductCategoriesContext = createContext<ProductCategoriesContextValue | null>(null);

export function ProductCategoriesProvider({ children }: { children: ReactNode }) {
  const [listBusinessId, setListBusinessId] = useState<string | null>(null);
  const [listPagination, setListPagination] = useState<ListPaginationParams | undefined>(undefined);
  const listQuery = useListProductCategories(listBusinessId, listPagination);
  const createProductCategory = useCreateProductCategory();
  const updateProductCategory = useUpdateProductCategory();
  const deleteProductCategory = useDeleteProductCategory();

  const value = useMemo<ProductCategoriesContextValue>(
    () => ({
      listBusinessId,
      setListBusinessId,
      listPagination,
      setListPagination,
      data: listQuery.data,
      items: listQuery.data?.items,
      meta: listQuery.data?.meta,
      isLoading: listQuery.isLoading,
      isFetching: listQuery.isFetching,
      isPending: listQuery.isPending,
      error: listQuery.error,
      refetch: listQuery.refetch,
      createProductCategory,
      updateProductCategory,
      deleteProductCategory,
    }),
    [
      listBusinessId,
      listPagination,
      listQuery.data,
      listQuery.isLoading,
      listQuery.isFetching,
      listQuery.isPending,
      listQuery.error,
      listQuery.refetch,
      createProductCategory,
      updateProductCategory,
      deleteProductCategory,
    ]
  );

  return (
    <ProductCategoriesContext.Provider value={value}>
      {children}
    </ProductCategoriesContext.Provider>
  );
}

export function useProductCategories(): ProductCategoriesContextValue {
  const ctx = useContext(ProductCategoriesContext);
  if (!ctx) {
    throw new Error('useProductCategories debe usarse dentro de ProductCategoriesProvider');
  }
  return ctx;
}

export { useProductCategory } from '@/hooks/api/product-categories';
export type { ProductCategory };
