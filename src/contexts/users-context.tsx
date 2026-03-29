'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UserWithRolesAndBusinesses } from '@/lib/sdk/types';
import type { ListPaginationParams, PaginatedResult, PaginationMeta } from '@/lib/sdk/types';
import { useListUsers, useUpdateUser } from '@/hooks/api/users';

export type UsersContextValue = {
  listParams: ListPaginationParams | undefined;
  setListParams: (params: ListPaginationParams | undefined) => void;
  data: PaginatedResult<UserWithRolesAndBusinesses> | undefined;
  items: UserWithRolesAndBusinesses[] | undefined;
  meta: PaginationMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  updateUser: ReturnType<typeof useUpdateUser>;
};

const UsersContext = createContext<UsersContextValue | null>(null);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [listParams, setListParams] = useState<ListPaginationParams | undefined>(undefined);
  const listQuery = useListUsers(listParams);
  const updateUser = useUpdateUser();

  const value = useMemo<UsersContextValue>(
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
      updateUser,
    }),
    [
      listParams,
      listQuery.data,
      listQuery.isLoading,
      listQuery.isFetching,
      listQuery.isPending,
      listQuery.error,
      listQuery.refetch,
      updateUser,
    ]
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers(): UsersContextValue {
  const ctx = useContext(UsersContext);
  if (!ctx) {
    throw new Error('useUsers debe usarse dentro de UsersProvider');
  }
  return ctx;
}

export { useUser } from '@/hooks/api/users';
export type { UserWithRolesAndBusinesses };
