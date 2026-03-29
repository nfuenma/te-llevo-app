'use client';

import { useRegion } from '@/contexts';
import { MiniCardHorizontalStrip } from '@/components/ui/MiniCardHorizontalStrip';

type CategoryPickerStripProps = {
  regionId: string;
  currentCategoryId: string;
};

export function CategoryPickerStrip({ regionId, currentCategoryId }: CategoryPickerStripProps) {
  const { data: region, isLoading } = useRegion(regionId);
  const items =
    region?.categories?.map((rc) => ({
      id: rc.category.id,
      name: rc.category.name,
      image: rc.category.image,
    })) ?? [];

  return (
    <MiniCardHorizontalStrip
      items={items}
      currentId={currentCategoryId}
      getHref={(id) => `/regiones/${regionId}/categorias/${id}`}
      ariaLabel="Cambiar de categoría"
      isLoading={isLoading}
    />
  );
}
