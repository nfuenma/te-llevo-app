'use client';

import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useListProducts } from '@/hooks/api/products';
import { useRegion } from '@/hooks/api/regions';
import { useCategory } from '@/hooks/api/categories';
import { useBusiness } from '@/hooks/api/businesses';
import { ItemCard } from '@/components/ui/ItemCard';
import { CatalogLayout } from '@/components/layouts/CatalogLayout';

export default function BusinessProductsPage() {
  const params = useParams();
  const regionId = params.regionId as string;
  const categoryId = params.categoryId as string;
  const businessId = params.businessId as string;

  const { data: region } = useRegion(regionId);
  const { data: category } = useCategory(categoryId);
  const { data: business } = useBusiness(businessId);
  const { data: products, isLoading, error } = useListProducts({ businessId });

  const regionName = region?.name ?? 'Región';
  const categoryName = category?.name ?? 'Categoría';
  const businessName = business?.name ?? 'Negocio';

  if (isLoading) {
    return (
      <CatalogLayout
        title={businessName}
        breadcrumbs={[
          { label: regionName, href: `/regiones/${regionId}` },
          { label: categoryName, href: `/regiones/${regionId}/categorias/${categoryId}` },
          { label: businessName, href: `/regiones/${regionId}/categorias/${categoryId}/negocios/${businessId}` },
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
      <CatalogLayout
        title={businessName}
        breadcrumbs={[
          { label: regionName },
          { label: categoryName },
          { label: businessName },
        ]}
      >
        <Typography color="error">No se pudieron cargar los productos.</Typography>
      </CatalogLayout>
    );
  }

  return (
    <CatalogLayout
      title={businessName}
      breadcrumbs={[
        { label: regionName, href: `/regiones/${regionId}` },
        { label: categoryName, href: `/regiones/${regionId}/categorias/${categoryId}` },
        { label: businessName, href: `/regiones/${regionId}/categorias/${categoryId}/negocios/${businessId}` },
      ]}
    >
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Productos de este negocio.
      </Typography>
      {!products?.length ? (
        <Typography color="text.secondary">No hay productos.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ItemCard
                title={product.name}
                image={product.image}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </CatalogLayout>
  );
}
