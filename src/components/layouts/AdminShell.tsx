'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PublicIcon from '@mui/icons-material/Public';
import Tooltip from '@mui/material/Tooltip';
import { signOut } from 'next-auth/react';
import { canManageCatalog, isSuperadmin, ROLES } from '@/lib/auth/roles';
import PeopleIcon from '@mui/icons-material/People';
import { useThemeMode } from '@/theme';

const DRAWER_WIDTH = 260;
const MINI_BAR_WIDTH = 72;
const APP_BAR_HEIGHT = 64;
const SWIPE_THRESHOLD = 50;

const fullNavItems = [
  { href: '/admin', label: 'Inicio', icon: <DashboardIcon /> },
  { href: '/admin/regiones', label: 'Regiones', icon: <PublicIcon /> },
  { href: '/admin/categorias', label: 'Categorías', icon: <CategoryIcon /> },
  { href: '/admin/negocios', label: 'Negocios', icon: <StorefrontIcon /> },
  { href: '/admin/categorias-producto', label: 'Categorías producto', icon: <LabelIcon /> },
  { href: '/admin/productos', label: 'Productos', icon: <InventoryIcon /> },
];

const superadminNavItem = { href: '/admin/usuarios', label: 'Usuarios', icon: <PeopleIcon /> };

const businessOnlyNavItems = [
  { href: '/admin', label: 'Inicio', icon: <DashboardIcon /> },
  { href: '/admin/negocios', label: 'Mis negocios', icon: <StorefrontIcon /> },
  { href: '/admin/categorias-producto', label: 'Categorías producto', icon: <LabelIcon /> },
  { href: '/admin/productos', label: 'Productos', icon: <InventoryIcon /> },
];

type AdminShellProps = {
  children: React.ReactNode;
  roles: string[];
  managedBusinessIds: string[];
};

export function AdminShell({ children, roles, managedBusinessIds }: AdminShellProps) {
  const pathname = usePathname();
  const { mode, toggleMode } = useThemeMode();
  const [fullDrawerOpen, setFullDrawerOpen] = React.useState(false);
  const touchStartX = React.useRef<number>(0);

  const isBusinessOnly =
    roles?.includes(ROLES.BUSINESS) &&
    !canManageCatalog(roles) &&
    Array.isArray(managedBusinessIds) &&
    managedBusinessIds.length > 0;
  const showUsuarios = isSuperadmin(roles);
  const navItems = isBusinessOnly
    ? businessOnlyNavItems
    : [...fullNavItems, ...(showUsuarios ? [superadminNavItem] : [])];

  const sidebarWidth = fullDrawerOpen ? DRAWER_WIDTH : MINI_BAR_WIDTH;

  const handleOpenFull = () => setFullDrawerOpen(true);
  const handleCloseFull = () => setFullDrawerOpen(false);

  const handleMiniBarTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleMiniBarTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD) setFullDrawerOpen(true);
  };
  const handleFullDrawerTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleFullDrawerTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX < -SWIPE_THRESHOLD) setFullDrawerOpen(false);
  };

  const miniBarContent = (
    <>
      <List sx={{ flexGrow: 1, overflow: 'auto', py: 1, px: 0 }}>
        {navItems.map((item) => (
          <Tooltip key={item.href} title={item.label} placement="right">
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              sx={{
                borderRadius: 1,
                justifyContent: 'center',
                px: 1.5,
                minHeight: 48,
                mx: 0.5,
                '&.Mui-selected': { bgcolor: 'action.selected' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Box sx={{ p: 0.5, borderTop: 1, borderColor: 'divider' }}>
        <Tooltip title="Expandir menú" placement="right">
          <IconButton
            onClick={handleOpenFull}
            aria-label="Expandir menú"
            sx={{ width: '100%', borderRadius: 1, py: 1.5 }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );

  const fullDrawerContent = (
    <Box
      sx={{ width: DRAWER_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}
      onTouchStart={handleFullDrawerTouchStart}
      onTouchEnd={handleFullDrawerTouchEnd}
    >
      <List sx={{ flexGrow: 1, overflow: 'auto', py: 1, px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            selected={pathname === item.href}
            onClick={handleCloseFull}
            sx={{
              borderRadius: 1,
              minHeight: 48,
              '&.Mui-selected': { bgcolor: 'action.selected' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ noWrap: true }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 0.5, borderTop: 1, borderColor: 'divider' }}>
        <Tooltip title="Contraer menú" placement="right">
          <IconButton
            onClick={handleCloseFull}
            aria-label="Contraer menú"
            sx={{ width: '100%', borderRadius: 1, py: 1.5 }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          ml: { md: `${sidebarWidth}px` },
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="span" sx={{ flexGrow: 1 }}>
            Administración
          </Typography>
          <Tooltip title={mode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
            <IconButton color="inherit" onClick={toggleMode} aria-label={mode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Cerrar sesión">
            <IconButton color="inherit" onClick={() => signOut({ callbackUrl: '/' })} aria-label="Cerrar sesión">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Mini bar: siempre visible, solo iconos */}
      <Drawer
        variant="permanent"
        sx={{
          width: MINI_BAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: MINI_BAR_WIDTH,
            boxSizing: 'border-box',
            top: APP_BAR_HEIGHT,
            height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
            borderRight: 1,
            borderColor: 'divider',
            overflowX: 'hidden',
          },
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
          onTouchStart={handleMiniBarTouchStart}
          onTouchEnd={handleMiniBarTouchEnd}
        >
          {miniBarContent}
        </Box>
      </Drawer>

      {/* Drawer temporal: swipe o botón para abrir, muestra menú completo */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={fullDrawerOpen}
        onClose={handleCloseFull}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: APP_BAR_HEIGHT,
            height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
            left: 0,
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
        ModalProps={{
          keepMounted: true,
          slotProps: {
            backdrop: {
              sx: { backgroundColor: 'transparent' },
            },
          },
        }}
      >
        {fullDrawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          mt: `${APP_BAR_HEIGHT}px`,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
