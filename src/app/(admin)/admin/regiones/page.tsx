import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AdminRegionesCrud } from '@/features/admin/AdminRegionesCrud';

export default function AdminRegionesPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Regiones
      </Typography>
      <Typography color="text.secondary" paragraph>
        Crear regiones y asignarles categorías de negocios. Una categoría puede estar en varias regiones.
      </Typography>
      <AdminRegionesCrud />
    </Box>
  );
}
