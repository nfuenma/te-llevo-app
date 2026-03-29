'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Product, ProductWithBusiness } from '@/lib/sdk/types';
import type { PaginatedResult, PaginationMeta } from '@/lib/sdk/types';
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  type ProductsListParams,
} from '@/hooks/api/products';

export type ProductsContextValue = {
  listParams: ProductsListParams | undefined;
  setListParams: (params: ProductsListParams | undefined) => void;
  data: PaginatedResult<ProductWithBusiness> | undefined;
  items: ProductWithBusiness[] | undefined;
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  createProduct: ReturnType<typeof useCreateProduct>;
  updateProduct: ReturnType<typeof useUpdateProduct>;
  deleteProduct: ReturnType<typeof useDeleteProduct>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [listParams, setListParams] = useState<ProductsListParams | undefined>(undefined);
  const listQuery = useListProducts(listParams);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const value = useMemo<ProductsContextValue>(
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
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      listParams,
      listQuery.data,
      listQuery.isLoading,
      listQuery.isFetching,
      listQuery.isPending,
      listQuery.error,
      listQuery.refetch,
      createProduct,
      updateProduct,
      deleteProduct,
    ]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProducts debe usarse dentro de ProductsProvider');
  }
  return ctx;
}

export type { ProductsListParams };
export { useProduct } from '@/hooks/api/products';
export type { Product, ProductWithBusiness };
