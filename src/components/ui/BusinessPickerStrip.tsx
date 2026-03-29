'use client';

import { useListBusinesses } from '@/hooks/api/businesses';
import { MiniCardHorizontalStrip } from '@/components/ui/MiniCardHorizontalStrip';

type BusinessPickerStripProps = {
  regionId: string;
  categoryId: string;
  currentBusinessId: string;
};

export function BusinessPickerStrip({
  regionId,
  categoryId,
  currentBusinessId,
}: BusinessPickerStripProps) {
  const { data: businessesPage, isLoading } = useListBusinesses({ categoryId });
  const businesses = businessesPage?.items;

  const items =
    businesses?.map((b) => ({
      id: b.id,
      name: b.name,
      image: b.image,
    })) ?? [];

  return (
    <MiniCardHorizontalStrip
      items={items}
      currentId={currentBusinessId}
      getHref={(id) =>
        `/regiones/${regionId}/categorias/${categoryId}/negocios/${id}`
      }
      ariaLabel="Cambiar de negocio"
      isLoading={isLoading}
    />
  );
}
