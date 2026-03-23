'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export type MiniCardStripItem = {
  id: string;
  name: string;
  image?: string | null;
};

const CARD_IMAGE_HEIGHT = 56;

type MiniCardHorizontalStripProps = {
  items: MiniCardStripItem[];
  currentId: string;
  getHref: (id: string) => string;
  ariaLabel: string;
  isLoading?: boolean;
};

export function MiniCardHorizontalStrip({
  items,
  currentId,
  getHref,
  ariaLabel,
  isLoading,
}: MiniCardHorizontalStripProps) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: CARD_IMAGE_HEIGHT + 48,
          mb: 2,
        }}
      >
        <CircularProgress size={22} />
      </Box>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <Box
      role="list"
      aria-label={ariaLabel}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 1,
        width: '100%',
        overflowX: 'auto',
        pb: 0.5,
        mb: 3,
        scrollSnapType: { xs: 'x mandatory', sm: 'none' },
        WebkitOverflowScrolling: 'touch',
        scrollbarGutter: 'stable',
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 3,
          bgcolor: 'action.disabled',
        },
      }}
    >
      {items.map((item) => {
        const selected = item.id === currentId;
        return (
          <Box
            key={item.id}
            role="listitem"
            sx={(theme) => ({
              flex: '0 0 auto',
              width: `calc((100% - ${theme.spacing(3)}) / 4)`,
              minWidth: 0,
              scrollSnapAlign: 'start',
            })}
          >
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                borderWidth: 2,
                borderColor: selected ? 'primary.main' : 'divider',
                ...(selected && { bgcolor: 'action.selected' }),
                '&:hover': { boxShadow: 2 },
              }}
            >
              <CardActionArea
                component={Link}
                href={getHref(item.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  flexGrow: 1,
                }}
              >
                {item.image ? (
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{
                      height: CARD_IMAGE_HEIGHT,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: CARD_IMAGE_HEIGHT,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.name.charAt(0)}
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ py: 0.75, px: 0.75, '&:last-child': { pb: 0.75 } }}>
                  <Typography
                    variant="caption"
                    component="span"
                    display="block"
                    textAlign="center"
                    fontWeight={selected ? 600 : 500}
                    color={selected ? 'primary' : 'text.primary'}
                    noWrap
                    title={item.name}
                  >
                    {item.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
}
