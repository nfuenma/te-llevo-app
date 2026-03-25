'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

export type MiniCardStripItem = {
  id: string;
  name: string;
  image?: string | null;
};

const STRIP_ITEM_MIN_HEIGHT = 120;

type MiniCardHorizontalStripProps = {
  items: MiniCardStripItem[];
  currentId: string;
  getHref: (id: string) => string;
  ariaLabel: string;
  isLoading?: boolean;
};

function StripCardMedia({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
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
          alt={name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <Typography variant="subtitle2" color="text.secondary">
          {name.charAt(0)}
        </Typography>
      )}
    </Box>
  );
}

export function MiniCardHorizontalStrip({
  items,
  currentId,
  getHref,
  ariaLabel,
  isLoading,
}: MiniCardHorizontalStripProps) {
  const theme = useTheme();
  const { pickerStripAccents } = theme.palette;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: STRIP_ITEM_MIN_HEIGHT,
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
      {items.map((item, index) => {
        const selected = item.id === currentId;
        const accentRamp =
          pickerStripAccents.length > 0
            ? pickerStripAccents
            : [theme.palette.primary.main];
        const accent = accentRamp[index % accentRamp.length];
        return (
          <Box
            key={item.id}
            sx={(theme) => ({
              flex: '0 0 auto',
              width: `calc((100% - ${theme.spacing(3)}) / 4)`,
              minWidth: 0,
              scrollSnapAlign: 'start',
            })}
          >
            <Link
              href={getHref(item.id)}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Card
                  variant="outlined"
                  sx={(theme) => {
                    const idleAlpha = theme.palette.mode === 'dark' ? 0.5 : 0.8;
                    const selectedAlpha = theme.palette.mode === 'dark' ? 0.7 : 0.8;
                    return {
                      width: '100%',
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 1,
                      borderRadius: 3,
                      padding: 1.5,
                      borderColor: selected ? accent : 'transparent',
                      bgcolor: alpha(accent, selected ? selectedAlpha : idleAlpha),
                      '&:hover': { borderColor: accent },
                    };
                  }}
                >
                  <StripCardMedia name={item.name} image={item.image} />
                </Card>
                <Typography
                  variant="caption"
                  component="span"
                  display="block"
                  textAlign="center"
                  fontWeight={selected ? 600 : 500}
                  color={selected ? undefined : 'text.primary'}
                  sx={{
                    mt: 0.75,
                    ...(selected && { color: accent }),
                  }}
                  noWrap
                  title={item.name}
                >
                  {item.name}
                </Typography>
              </Box>
            </Link>
          </Box>
        );
      })}
    </Box>
  );
}
