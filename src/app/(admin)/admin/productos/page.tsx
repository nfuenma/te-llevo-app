import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AdminProductosCrud } from '@/features/admin/AdminProductosCrud';

export default function AdminProductosPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Productos
      </Typography>
      <Typography color="text.secondary" paragraph>
        Crear, editar y eliminar productos.
      </Typography>
      <AdminProductosCrud />
    </Box>
  );
}
