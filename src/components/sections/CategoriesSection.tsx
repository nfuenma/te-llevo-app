'use client';

import { useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useCategories } from '@/contexts';
import { TeLlevoClass } from '@/theme/teLlevoClasses';

export function CategoriesSection() {
  const { setListParams, items: categories, isLoading, error } = useCategories();

  useLayoutEffect(() => {
    setListParams(undefined);
    return () => setListParams(undefined);
  }, [setListParams]);

  if (isLoading) {
    return (
      <Box className={TeLlevoClass.loadingCenter}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" className={TeLlevoClass.pageMessage}>
        No se pudieron cargar las categorías. Intenta de nuevo.
      </Typography>
    );
  }

  if (!categories?.length) {
    return (
      <Typography color="text.secondary" className={TeLlevoClass.pageMessage}>
        Aún no hay categorías.
      </Typography>
    );
  }

  return (
    <Box className={TeLlevoClass.catalogList}>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {category.image ? (
                <CardMedia component="img" height="140" image={category.image} alt={category.name} />
              ) : null}
              <CardContent className={TeLlevoClass.catalogCardContent}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {category.name}
                </Typography>
                {category._count.businesses > 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {category._count.businesses} negocio
                    {category._count.businesses !== 1 ? 's' : ''}
                  </Typography>
                ) : null}
                {category.tags?.length > 0 ? (
                  <Box className={TeLlevoClass.chipRow}>
                    {category.tags.slice(0, 5).map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                    {category.tags.length > 5 ? (
                      <Chip label={`+${category.tags.length - 5}`} size="small" variant="outlined" />
                    ) : null}
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
