'use client';

import { useMemo } from 'react';
import { useListRegions } from '@/hooks/api/regions';
import { RegionsAvatarStrip } from '@/components/ui/RegionsAvatarStrip';

type RegionPickerStripProps = {
  currentRegionId: string;
};

export function RegionPickerStrip({ currentRegionId }: RegionPickerStripProps) {
  const { data: regionsPage, isLoading } = useListRegions();
  const regions = regionsPage?.items;

  const items = useMemo(
    () =>
      regions
        ? [...regions].sort((a, b) => a.name.localeCompare(b.name)).map((r) => ({
            id: r.id,
            name: r.name,
            image: r.image,
          }))
        : [],
    [regions]
  );

  return (
    <RegionsAvatarStrip
      items={items}
      selectedId={currentRegionId}
      getHref={(id) => `/regiones/${id}`}
      ariaLabel="Cambiar de región"
      isLoading={isLoading}
    />
  );
}
