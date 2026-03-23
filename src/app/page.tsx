import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { RegionsGrid } from '@/components/sections/RegionsGrid';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Elige una región para ver sus categorías de negocios a.
      </Typography>
      <RegionsGrid />
    </Container>
  );
}
