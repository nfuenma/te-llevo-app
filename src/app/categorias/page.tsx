import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { LinkButton } from '@/components/ui/LinkButton';

export default function CategoriasPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Categorías</Typography>
        <LinkButton href="/" variant="outlined">
          Volver al inicio
        </LinkButton>
      </Box>
      <CategoriesSection />
    </Container>
  );
}
