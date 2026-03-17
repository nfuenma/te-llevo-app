import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AdminProductCategoriesCrud } from '@/features/admin/AdminProductCategoriesCrud';

export default function AdminProductCategoriesPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Categorías de producto
      </Typography>
      <Typography color="text.secondary" paragraph>
        Cada negocio tiene sus propias categorías para clasificar productos. Elige un negocio y crea o edita sus categorías.
      </Typography>
      <AdminProductCategoriesCrud />
    </Box>
  );
}
