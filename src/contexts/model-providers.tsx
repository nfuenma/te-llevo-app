'use client';

import type { ReactNode } from 'react';
import { RegionsProvider } from './regions-context';
import { CategoriesProvider } from './categories-context';
import { BusinessesProvider } from './businesses-context';
import { ProductsProvider } from './products-context';
import { UsersProvider } from './users-context';
import { RolesProvider } from './roles-context';
import { ProductCategoriesProvider } from './product-categories-context';

/**
 * Proveedores por modelo: centralizan queries/mutaciones de React Query.
 * Usa los hooks `useRegions`, `useCategories`, etc. en los componentes.
 */
export function ModelProviders({ children }: { children: ReactNode }) {
  return (
    <RegionsProvider>
      <CategoriesProvider>
        <BusinessesProvider>
          <ProductsProvider>
            <UsersProvider>
              <RolesProvider>
                <ProductCategoriesProvider>{children}</ProductCategoriesProvider>
              </RolesProvider>
            </UsersProvider>
          </ProductsProvider>
        </BusinessesProvider>
      </CategoriesProvider>
    </RegionsProvider>
  );
}
