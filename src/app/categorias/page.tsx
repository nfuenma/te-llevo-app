import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { CategoriesSection } from '@/components/sections/CategoriesSection';

export default function CategoriasPage() {
  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" display="block">
            Directorio
          </Typography>
          <Typography variant="h4" component="h1" fontWeight={800}>
            Categorías
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            Listado global de rubros. Para ver locales por zona, elige una región en inicio.
          </Typography>
        </Box>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, alignSelf: 'flex-start' }}>
          <Button variant="outlined" component="span" sx={{ borderRadius: 999 }}>
            Inicio
          </Button>
        </Link>
      </Box>
      <CategoriesSection />
    </Container>
  );
}
