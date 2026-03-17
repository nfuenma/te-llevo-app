'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useListCategories } from '@/hooks/api/categories';

export function CategoriesSection() {
  const { data: categories, isLoading, error } = useListCategories();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ py: 2 }}>
        No se pudieron cargar las categorías. Intenta de nuevo.
      </Typography>
    );
  }

  if (!categories?.length) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        Aún no hay categorías.
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Categorías
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: 2,
                },
              }}
            >
              {category.image ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: 'cover' }}
                />
              ) : null}
              <CardContent sx={{ flexGrow: 1 }}>
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
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {category.tags.slice(0, 5).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {category.tags.length > 5 ? (
                      <Chip
                        label={`+${category.tags.length - 5}`}
                        size="small"
                        variant="outlined"
                      />
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
