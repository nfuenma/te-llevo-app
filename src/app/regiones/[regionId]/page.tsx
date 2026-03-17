'use client';

import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useRegion } from '@/hooks/api/regions';
import { ItemCard } from '@/components/ui/ItemCard';
import { CatalogLayout } from '@/components/layouts/CatalogLayout';

export default function RegionCategoriesPage() {
  const params = useParams();
  const regionId = params.regionId as string;
  const { data: region, isLoading, error } = useRegion(regionId);

  if (isLoading) {
    return (
      <CatalogLayout title="Cargando...">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </CatalogLayout>
    );
  }

  if (error || !region) {
    return (
      <CatalogLayout title="Región">
        <Typography color="error">No se encontró la región.</Typography>
      </CatalogLayout>
    );
  }

  const categories = region.categories?.map((rc) => rc.category) ?? [];

  return (
    <CatalogLayout
      title={region.name}
      breadcrumbs={[{ label: region.name }]}
    >
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Categorías en esta región. Elige una para ver los negocios.
      </Typography>
      {categories.length === 0 ? (
        <Typography color="text.secondary">No hay categorías en esta región.</Typography>
      ) : (
        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ItemCard
                href={`/regiones/${regionId}/categorias/${cat.id}`}
                title={cat.name}
                image={cat.image}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </CatalogLayout>
  );
}
