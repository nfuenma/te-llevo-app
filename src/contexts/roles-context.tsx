'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ListPaginationParams, PaginatedResult, PaginationMeta } from '@/lib/sdk/types';
import {
  useListRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  type RoleOption,
} from '@/hooks/api/roles';

export type RolesContextValue = {
  listParams: ListPaginationParams | undefined;
  setListParams: (params: ListPaginationParams | undefined) => void;
  data: PaginatedResult<RoleOption> | undefined;
  items: RoleOption[] | undefined;
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  createRole: ReturnType<typeof useCreateRole>;
  updateRole: ReturnType<typeof useUpdateRole>;
  deleteRole: ReturnType<typeof useDeleteRole>;
};

const RolesContext = createContext<RolesContextValue | null>(null);

export function RolesProvider({ children }: { children: ReactNode }) {
  const [listParams, setListParams] = useState<ListPaginationParams | undefined>(undefined);
  const listQuery = useListRoles(listParams);
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const value = useMemo<RolesContextValue>(
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
      createRole,
      updateRole,
      deleteRole,
    }),
    [
      listParams,
      listQuery.data,
      listQuery.isLoading,
      listQuery.isFetching,
      listQuery.isPending,
      listQuery.error,
      listQuery.refetch,
      createRole,
      updateRole,
      deleteRole,
    ]
  );

  return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
}

export function useRoles(): RolesContextValue {
  const ctx = useContext(RolesContext);
  if (!ctx) {
    throw new Error('useRoles debe usarse dentro de RolesProvider');
  }
  return ctx;
}

export type { RoleOption };
