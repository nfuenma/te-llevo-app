'use client';

import { useListRegions } from '@/hooks/api/regions';
import { MiniCardHorizontalStrip } from '@/components/ui/MiniCardHorizontalStrip';

type RegionPickerStripProps = {
  currentRegionId: string;
};

export function RegionPickerStrip({ currentRegionId }: RegionPickerStripProps) {
  const { data: regions, isLoading } = useListRegions();

  const items =
    regions?.map((r) => ({
      id: r.id,
      name: r.name,
      image: r.image,
    })) ?? [];

  return (
    <MiniCardHorizontalStrip
      items={items}
      currentId={currentRegionId}
      getHref={(id) => `/regiones/${id}`}
      ariaLabel="Cambiar de región"
      isLoading={isLoading}
    />
  );
}
