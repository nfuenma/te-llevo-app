'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
        Entra con Google para acceder al panel de administración.
      </Typography>
      <Button
        variant="contained"
        onClick={() => signIn('google', { callbackUrl })}
        fullWidth
        sx={{ mt: 2 }}
      >
        Continuar con Google
      </Button>
    </Box>
  );
}

export default function SignInPage() {
  return (
    <Container maxWidth="sm">
      <Suspense fallback={<Box sx={{ mt: 8, textAlign: 'center' }}>Cargando…</Box>}>
        <SignInForm />
      </Suspense>
    </Container>
  );
}
