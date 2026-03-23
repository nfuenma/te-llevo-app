'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

type ItemCardProps = {
  href?: string;
  title: string;
  image?: string | null;
};

function CardContentInner({ title, image }: { title: string; image?: string | null }) {
  return (
    <>
      {image ? (
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" color="text.secondary">
            {title.charAt(0)}
          </Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" noWrap title={title}>
          {title}
        </Typography>
      </CardContent>
    </>
  );
}

export function ItemCard({ href, title, image }: ItemCardProps) {
  const cardSx = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'box-shadow 0.2s',
    ...(href && {
      '&:hover': { boxShadow: 2 },
    }),
  };

  return (
    <Card variant="outlined" sx={cardSx}>
      {href ? (
        <CardActionArea
          component={Link}
          href={href}
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        >
          <CardContentInner title={title} image={image} />
        </CardActionArea>
      ) : (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <CardContentInner title={title} image={image} />
        </Box>
      )}
    </Card>
  );
}
