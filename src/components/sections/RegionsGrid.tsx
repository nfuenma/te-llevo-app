'use client';

import { useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useRegions } from '@/contexts';
import { ItemCard } from '@/components/ui/ItemCard';
import { TeLlevoClass } from '@/theme/teLlevoClasses';

export function RegionsGrid() {
  const { setListParams, items: regions, isLoading, error } = useRegions();

  useLayoutEffect(() => {
    setListParams(undefined);
    return () => setListParams(undefined);
  }, [setListParams]);

  if (isLoading) {
    return (
      <Box className={TeLlevoClass.loadingCenterSpacious}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" className={TeLlevoClass.pageMessage}>
        No se pudieron cargar las regiones.
      </Typography>
    );
  }

  if (!regions?.length) {
    return (
      <Typography color="text.secondary" className={TeLlevoClass.pageMessage}>
        Aún no hay regiones.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {regions.map((region) => (
        <Grid key={region.id} size={{ xs: 6, sm: 4, md: 4 }}>
          <ItemCard href={`/regiones/${region.id}`} title={region.name} image={region.image} />
        </Grid>
      ))}
    </Grid>
  );
}
