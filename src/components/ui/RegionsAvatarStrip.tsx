'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { TeLlevoClass } from '@/theme/teLlevoClasses';

export type RegionAvatarItem = {
  id: string;
  name: string;
  image?: string | null;
};

type RegionsAvatarStripProps = {
  items: RegionAvatarItem[];
  selectedId: string;
  ariaLabel: string;
  isLoading?: boolean;
  /** Si se define, cada ítem navega como enlace (p. ej. `/regiones/:id`). */
  getHref?: (id: string) => string;
  /** Si no hay `getHref`, se usa selección local (p. ej. home). */
  onSelect?: (id: string) => void;
};

export function RegionsAvatarStrip({
  items,
  selectedId,
  ariaLabel,
  isLoading,
  getHref,
  onSelect,
}: RegionsAvatarStripProps) {
  if (isLoading) {
    return (
      <Box className={TeLlevoClass.loadingCenterTight}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <Box role="list" aria-label={ariaLabel} className={TeLlevoClass.regionsStrip}>
      {items.map((item) => {
        const selected = item.id === selectedId;
        const avatar = (
          <Avatar
            src={item.image ?? undefined}
            alt=""
            className={TeLlevoClass.regionAvatar}
            data-selected={selected ? 'true' : undefined}
          >
            {!item.image ? item.name.charAt(0) : null}
          </Avatar>
        );

        const label = (
          <Typography
            variant="caption"
            component="span"
            className={TeLlevoClass.regionAvatarCaption}
            data-selected={selected ? 'true' : undefined}
            title={item.name}
          >
            {item.name}
          </Typography>
        );

        const inner = (
          <Box className={TeLlevoClass.regionItemStack}>
            {avatar}
            {label}
          </Box>
        );

        if (getHref) {
          return (
            <Box key={item.id} component="span" role="listitem">
              <ButtonBase
                focusRipple
                component={Link}
                href={getHref(item.id)}
                className={TeLlevoClass.regionItemHit}
              >
                {inner}
              </ButtonBase>
            </Box>
          );
        }

        return (
          <Box key={item.id} role="listitem">
            <ButtonBase
              onClick={() => onSelect?.(item.id)}
              aria-pressed={selected}
              className={TeLlevoClass.regionItemHit}
            >
              {inner}
            </ButtonBase>
          </Box>
        );
      })}
    </Box>
  );
}
