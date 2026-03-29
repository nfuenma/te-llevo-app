import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function FavoritosPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
        Favoritos
      </Typography>
      <Typography color="text.secondary" variant="body1">
        Pronto podrás guardar negocios y rutas aquí.
      </Typography>
      <Box sx={{ mt: 2, height: 1 }} />
    </Container>
  );
}
