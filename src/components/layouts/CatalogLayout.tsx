'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

type BreadcrumbItem = { label: string; href?: string };

type CatalogLayoutProps = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
};

export function CatalogLayout({ title, breadcrumbs, children }: CatalogLayoutProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Inicio
            </Link>
            {breadcrumbs.map((item) =>
              item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              ) : (
                <Typography key={item.label} color="text.primary">
                  {item.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}
      </Box>
      {children}
    </Container>
  );
}
