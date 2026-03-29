'use client';

import { useLayoutEffect, useMemo } from 'react';
import { useRegions } from '@/contexts';
import { RegionsAvatarStrip } from '@/components/ui/RegionsAvatarStrip';

type RegionPickerStripProps = {
  currentRegionId: string;
};

export function RegionPickerStrip({ currentRegionId }: RegionPickerStripProps) {
  const { setListParams, items: regions, isLoading } = useRegions();

  useLayoutEffect(() => {
    setListParams(undefined);
    return () => setListParams(undefined);
  }, [setListParams]);

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
