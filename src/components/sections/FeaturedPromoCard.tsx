'use client';

import Link from 'next/link';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import { TeLlevoClass } from '@/theme/teLlevoClasses';

const PROMO_IMAGE =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop';

type FeaturedPromoCardProps = {
  href?: string;
};

export function FeaturedPromoCard({ href = '/categorias' }: FeaturedPromoCardProps) {
  return (
    <Card component={Link} href={href} elevation={0} className={TeLlevoClass.promoCard}>
      <CardMedia
        component="img"
        className={TeLlevoClass.promoHeroMedia}
        image={PROMO_IMAGE}
        alt=""
      />
      <Box className={TeLlevoClass.promoGradient} />
      <Box className={TeLlevoClass.promoContent}>
        <Chip label="Destacado" size="small" className={TeLlevoClass.promoFeaturedChip} />
        <Typography variant="h5" className={TeLlevoClass.promoTitle}>
          Inmuebles Valles del Tuy
        </Typography>
        <Typography variant="body2" className={TeLlevoClass.promoSubtitle}>
          Encuentra tu próximo hogar en las zonas de la región.
        </Typography>
      </Box>
      <Fab component="span" size="medium" className={TeLlevoClass.promoSearchFab} aria-hidden>
        <SearchIcon />
      </Fab>
    </Card>
  );
}
