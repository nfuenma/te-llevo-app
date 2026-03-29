'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { TeLlevoClass } from '@/theme/teLlevoClasses';
import { useThemeMode } from '@/theme';

const pages = [
  { label: 'Inicio', href: '/' },
  { label: 'Categorías', href: '/categorias' },
];

export function ResponsiveAppBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { mode, toggleMode } = useThemeMode();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <AppBar position="fixed" elevation={0} className={TeLlevoClass.catalogAppBar}>
        <Toolbar disableGutters className={TeLlevoClass.catalogToolbar}>
          <Box className={TeLlevoClass.toolbarCluster}>
            <IconButton
              size="large"
              aria-label="Abrir menú"
              className={TeLlevoClass.appBarIcon}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" component={Link} href="/" className={TeLlevoClass.brandTitleLink}>
            Te Llevo
          </Typography>

          <Box className={TeLlevoClass.toolbarCluster}>
            <IconButton size="large" aria-label="Notificaciones" className={TeLlevoClass.appBarIcon}>
              <NotificationsNoneRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box className={TeLlevoClass.drawerPaper} role="presentation">
          <Typography variant="subtitle1" className={TeLlevoClass.drawerHeading}>
            Menú
          </Typography>
          <List>
            {pages.map((p) => (
              <ListItem key={p.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={p.href}
                  selected={pathname === p.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={p.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={toggleMode}>
                <ListItemIcon className={TeLlevoClass.drawerListItemIcon}>
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </ListItemIcon>
                <ListItemText primary={mode === 'light' ? 'Modo oscuro' : 'Modo claro'} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider className={TeLlevoClass.drawerDivider} />
          {status === 'loading' ? null : session?.user ? (
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/admin" onClick={() => setDrawerOpen(false)}>
                  <ListItemIcon className={TeLlevoClass.drawerListItemIcon}>
                    <AdminPanelSettingsOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Administrar" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    void signOut({ callbackUrl: '/' });
                  }}
                >
                  <ListItemIcon className={TeLlevoClass.drawerListItemIcon}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar sesión" />
                </ListItemButton>
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    void signIn('google', { callbackUrl: '/' });
                  }}
                >
                  <ListItemIcon className={TeLlevoClass.drawerListItemIcon}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Iniciar sesión" />
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}
