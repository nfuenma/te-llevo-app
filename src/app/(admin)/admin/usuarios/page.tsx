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
        En «Gestionar roles del sistema» puedes crear, editar y eliminar roles. Luego asigna esos roles a cada usuario con el botón de editar. Solo superadmin puede ver esta sección.
      </Typography>
      <AdminUsuariosCrud />
    </Box>
  );
}
