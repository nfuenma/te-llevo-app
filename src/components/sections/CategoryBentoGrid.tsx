'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { TeLlevoClass } from '@/theme/teLlevoClasses';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import TwoWheelerOutlinedIcon from '@mui/icons-material/TwoWheelerOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';

type Category = { id: string; name: string; image?: string | null };

const PATTERN: Array<'full' | 'half'> = [
  'full',
  'half',
  'half',
  'full',
  'half',
  'half',
];

const ICONS = [
  StorefrontOutlinedIcon,
  TwoWheelerOutlinedIcon,
  HandymanOutlinedIcon,
  SchoolOutlinedIcon,
  MedicalServicesOutlinedIcon,
  RestaurantOutlinedIcon,
] as const;

type CategoryBentoGridProps = {
  regionId: string;
  regionName: string;
  categories: Category[];
};

/** Patrón del mockup: fila ancha, dos medias, ancha, dos medias, … */
function chunkByPatternIndexed<T>(
  items: T[],
  pattern: Array<'full' | 'half'>
): { cat: T; globalIndex: number }[][] {
  const rows: { cat: T; globalIndex: number }[][] = [];
  let i = 0;
  let p = 0;
  let g = 0;
  while (i < items.length) {
    const kind = pattern[p % pattern.length];
    if (kind === 'full') {
      rows.push([{ cat: items[i], globalIndex: g }]);
      i += 1;
      p += 1;
      g += 1;
    } else {
      const row: { cat: T; globalIndex: number }[] = [{ cat: items[i], globalIndex: g }];
      i += 1;
      g += 1;
      if (i < items.length) {
        row.push({ cat: items[i], globalIndex: g });
        i += 1;
        g += 1;
      }
      rows.push(row);
      p += 2;
    }
  }
  return rows;
}

export function CategoryBentoGrid({ regionId, regionName, categories }: CategoryBentoGridProps) {
  const theme = useTheme();

  if (!categories.length) {
    return (
      <Typography color="text.secondary" className={TeLlevoClass.pageMessage}>
        No hay categorías en {regionName}.
      </Typography>
    );
  }

  const indexedRows = chunkByPatternIndexed(categories, PATTERN);

  return (
    <Box className={TeLlevoClass.bentoGrid}>
      {indexedRows.map((row, rowIndex) => (
        <Box
          key={`row-${rowIndex}`}
          className={TeLlevoClass.bentoRow}
          sx={{
            gridTemplateColumns: row.length > 1 ? '1fr 1fr' : '1fr',
          }}
        >
          {row.map(({ cat, globalIndex }) => {
            const Icon = ICONS[globalIndex % ICONS.length];
            const variant = globalIndex % 6;

            const bg =
              variant === 0
                ? theme.palette.background.paper
                : variant === 1
                  ? alpha(theme.palette.primary.main, 0.18)
                  : variant === 2
                    ? alpha(theme.palette.primary.main, 0.28)
                    : variant === 3
                      ? theme.palette.mode === 'light'
                        ? '#e8e6e4'
                        : alpha(theme.palette.common.white, 0.08)
                      : variant === 4
                        ? alpha('#e07a5f', 0.2)
                        : alpha(theme.palette.primary.main, 0.12);

            const iconBg =
              variant === 0
                ? theme.palette.primary.main
                : variant === 2
                  ? alpha(theme.palette.common.black, 0.65)
                  : variant === 5
                    ? alpha(theme.palette.secondary.main, 0.35)
                    : alpha(theme.palette.primary.main, 0.35);

            const iconColor =
              variant === 2
                ? theme.palette.common.white
                : variant === 5
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.dark;

            const isWide = row.length === 1;
            const isEducationRow = variant === 3 && isWide;

            return (
              <Paper
                key={cat.id}
                className={TeLlevoClass.bentoTile}
                component={Link}
                href={`/regiones/${regionId}/categorias/${cat.id}`}
                elevation={0}
                sx={{
                  bgcolor: bg,
                  p: isEducationRow ? 2.5 : 2,
                  minHeight: isWide ? { xs: 120, sm: 128 } : { xs: 112, sm: 120 },
                  flexDirection: isEducationRow && isWide ? 'row' : 'column',
                  alignItems: isEducationRow && isWide ? 'center' : 'flex-start',
                }}
              >
                <Box
                  className={`${TeLlevoClass.bentoTileInner} ${
                    isEducationRow && isWide ? TeLlevoClass.bentoTileInnerRow : TeLlevoClass.bentoTileInnerCol
                  }`}
                >
                  {!(isEducationRow && isWide) ? (
                    <Box className={TeLlevoClass.bentoIconWrap} sx={{ bgcolor: iconBg }}>
                      <Icon sx={{ fontSize: 26, color: iconColor }} />
                    </Box>
                  ) : null}
                  <Box className={TeLlevoClass.bentoTextBlock}>
                    <Typography variant="subtitle1" className={TeLlevoClass.bentoTileTitle}>
                      {cat.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className={TeLlevoClass.bentoTileSubtitle}>
                      {variant === 2 ? 'Servicios' : isEducationRow ? 'Escuelas, cursos y más' : 'Explora locales'}
                    </Typography>
                  </Box>
                </Box>
                {isEducationRow && isWide ? (
                  <Box className={TeLlevoClass.bentoEducationCircle}>
                    <SchoolOutlinedIcon sx={{ color: 'primary.dark', fontSize: 28 }} />
                  </Box>
                ) : null}
                {variant === 0 && isWide ? <Box className={TeLlevoClass.bentoDecoration} /> : null}
              </Paper>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
