'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRegion } from '@/hooks/api/regions';
import { RegionPickerStrip } from '@/components/ui/RegionPickerStrip';
import { CategoryBentoGrid } from '@/components/sections/CategoryBentoGrid';
import { FeaturedPromoCard } from '@/components/sections/FeaturedPromoCard';

export default function RegionCategoriesPage() {
  const params = useParams();
  const regionId = params.regionId as string;
  const { data: region, isLoading, error } = useRegion(regionId);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !region) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography color="error">No se encontró la región.</Typography>
      </Container>
    );
  }

  const categories =
    region.categories?.map((rc) => rc.category).sort((a, b) => a.name.localeCompare(b.name)) ?? [];

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1.5, gap: 2 }}>
        <Typography variant="h5" component="h1" fontWeight={800}>
          Explora regiones
        </Typography>
        <Button
          component={Link}
          href="/"
          size="small"
          sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none', minWidth: 'auto' }}
        >
          Ver todas
        </Button>
      </Box>
      <RegionPickerStrip currentRegionId={region.id} />
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="overline" color="text.secondary" display="block">
          Descubre
        </Typography>
        <Typography variant="h4" component="h2" fontWeight={800}>
          Categorías en {region.name}
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
          Elige una categoría para ver negocios en {region.name}.
        </Typography>
      </Box>
      <CategoryBentoGrid regionId={region.id} regionName={region.name} categories={categories} />
      <Box sx={{ mt: 4 }}>
        <FeaturedPromoCard />
      </Box>
    </Container>
  );
}
