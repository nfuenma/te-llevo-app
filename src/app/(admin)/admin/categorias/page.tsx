import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AdminCategoriesCrud } from '@/features/admin/AdminCategoriesCrud';

export default function AdminCategoriasPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Categorías
      </Typography>
      <Typography color="text.secondary" paragraph>
        Crear, editar y eliminar categorías.
      </Typography>
      <AdminCategoriesCrud />
    </Box>
  );
}
