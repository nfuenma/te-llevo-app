import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AdminNegociosCrud } from '@/features/admin/AdminNegociosCrud';

export default function AdminNegociosPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Negocios
      </Typography>
      <Typography color="text.secondary" paragraph>
        Crear, editar y eliminar negocios.
      </Typography>
      <AdminNegociosCrud />
    </Box>
  );
}
