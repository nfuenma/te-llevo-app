import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AdminUsuariosCrud } from '@/features/admin/AdminUsuariosCrud';

export default function AdminUsuariosPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Usuarios
      </Typography>
      <Typography color="text.secondary" paragraph>
        Asigna roles (superadmin, admin, business, client) y los negocios que cada usuario puede gestionar. Solo superadmin puede ver esta sección.
      </Typography>
      <AdminUsuariosCrud />
    </Box>
  );
}
