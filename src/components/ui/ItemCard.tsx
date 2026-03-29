'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';

type ItemCardProps = {
  href?: string;
  title: string;
  image?: string | null;
};

function CardMediaArea({ title, image }: { title: string; image?: string | null }) {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: image ? undefined : 'action.hover',
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <Typography variant="h4" color="text.secondary">
          {title.charAt(0)}
        </Typography>
      )}
    </Box>
  );
}

export function ItemCard({ href, title, image }: ItemCardProps) {
  const cardSx = {
    width: '100%',
    aspectRatio: '1 / 1',
    display: 'flex',
    flexDirection: 'column' as const,
    p: 1,
    boxSizing: 'border-box' as const,
    // Solo enlaces: feedback de hover (variant outlined no eleva en el tema global).
    ...(href && {
      '@media (hover: hover)': {
        '&:hover': { boxShadow: 2 },
      },
    }),
  };

  const actionSx = {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'stretch',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Card variant="outlined" sx={cardSx}>
        {href ? (
          <CardActionArea component={Link} href={href} sx={actionSx}>
            <CardMediaArea title={title} image={image} />
          </CardActionArea>
        ) : (
          <Box sx={actionSx}>
            <CardMediaArea title={title} image={image} />
          </Box>
        )}
      </Card>
      <Typography
        variant="h6"
        component="h2"
        noWrap
        title={title}
        sx={{ mt: 1, width: '100%', textAlign: 'center' }}
      >
        {title}
      </Typography>
    </Box>
  );
}
