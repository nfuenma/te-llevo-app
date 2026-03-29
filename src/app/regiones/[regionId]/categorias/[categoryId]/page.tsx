'use client';

import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useListBusinesses } from '@/hooks/api/businesses';
import { useRegion } from '@/hooks/api/regions';
import { useCategory } from '@/hooks/api/categories';
import { ItemCard } from '@/components/ui/ItemCard';
import { CategoryPickerStrip } from '@/components/ui/CategoryPickerStrip';
import { CatalogLayout } from '@/components/layouts/CatalogLayout';

export default function CategoryBusinessesPage() {
  const params = useParams();
  const regionId = params.regionId as string;
  const categoryId = params.categoryId as string;

  const { data: region } = useRegion(regionId);
  const { data: category } = useCategory(categoryId);
  const { data: businessesPage, isLoading, error } = useListBusinesses({ categoryId });
  const businesses = businessesPage?.items;

  const regionName = region?.name ?? 'Región';
  const categoryName = category?.name ?? 'Categoría';

  if (isLoading) {
    return (
      <CatalogLayout
        title={categoryName}
        breadcrumbs={[
          { label: regionName, href: `/regiones/${regionId}` },
          { label: categoryName, href: `/regiones/${regionId}/categorias/${categoryId}` },
        ]}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </CatalogLayout>
    );
  }

  if (error) {
    return (
      <CatalogLayout title={categoryName} breadcrumbs={[{ label: regionName }, { label: categoryName }]}>
        <Typography color="error">No se pudieron cargar los negocios.</Typography>
      </CatalogLayout>
    );
  }

  return (
    <CatalogLayout
      title={categoryName}
      breadcrumbs={[
        { label: regionName, href: `/regiones/${regionId}` },
        { label: categoryName, href: `/regiones/${regionId}/categorias/${categoryId}` },
      ]}
    >
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Negocios en esta categoría. Elige uno para ver sus productos.
      </Typography>
      <CategoryPickerStrip regionId={regionId} currentCategoryId={categoryId} />
      {!businesses?.length ? (
        <Typography color="text.secondary">No hay negocios en esta categoría.</Typography>
      ) : (
        <Grid container spacing={3}>
          {businesses.map((business) => (
            <Grid key={business.id} size={{ xs: 6, sm: 4, md: 4 }}>
              <ItemCard
                href={`/regiones/${regionId}/categorias/${categoryId}/negocios/${business.id}`}
                title={business.name}
                image={business.image}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </CatalogLayout>
  );
}
