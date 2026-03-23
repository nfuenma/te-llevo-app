'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useListRegions } from '@/hooks/api/regions';
import { ItemCard } from '@/components/ui/ItemCard';

export function RegionsGrid() {
  const { data: regions, isLoading, error } = useListRegions();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ py: 3 }}>
        No se pudieron cargar las regiones.
      </Typography>
    );
  }

  if (!regions?.length) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        Aún no hay regiones.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {regions.map((region) => (
        <Grid key={region.id} size={{ xs: 6, sm: 4, md: 4 }}>
          <ItemCard
            href={`/regiones/${region.id}`}
            title={region.name}
            image={region.image}
          />
        </Grid>
      ))}
    </Grid>
  );
}
