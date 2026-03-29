'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { TeLlevoClass } from '@/theme/teLlevoClasses';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: HomeRoundedIcon, match: (p: string) => p === '/' },
  {
    label: 'Categorías',
    href: '/categorias',
    icon: GridViewRoundedIcon,
    match: (p: string) => p.startsWith('/categorias'),
  },
  {
    label: 'Favoritos',
    href: '/favoritos',
    icon: FavoriteBorderRoundedIcon,
    match: (p: string) => p.startsWith('/favoritos'),
  },
  {
    label: 'Perfil',
    href: '/auth/signin',
    icon: PersonOutlineRoundedIcon,
    match: (p: string) => p.startsWith('/auth') || p.startsWith('/admin'),
  },
];

export function BottomNav() {
  const pathname = usePathname() ?? '';

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Paper component="nav" elevation={0} className={TeLlevoClass.bottomNav} aria-label="Navegación principal">
      <Box className={TeLlevoClass.bottomNavInner}>
        {NAV_ITEMS.map(({ label, href, icon: Icon, match }) => {
          const selected = match(pathname);
          return (
            <ButtonBase
              key={href}
              className={TeLlevoClass.bottomNavAction}
              component={Link}
              href={href}
              focusRipple
              data-selected={selected ? 'true' : undefined}
            >
              <Icon className={TeLlevoClass.bottomNavIcon} />
              <Typography variant="caption" className={TeLlevoClass.bottomNavLabel}>
                {label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Paper>
  );
}
