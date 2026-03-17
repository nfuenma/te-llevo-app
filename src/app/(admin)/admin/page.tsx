import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { isSuperadmin } from '@/lib/auth/roles';
import { LinkButton } from '@/components/ui/LinkButton';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const showUsuarios = isSuperadmin(session?.user?.roles);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Panel de administración
      </Typography>
      <Typography color="text.secondary" paragraph>
        Gestiona categorías, negocios y productos desde el menú lateral.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <LinkButton href="/admin/regiones" variant="contained">
          Regiones
        </LinkButton>
        <LinkButton href="/admin/categorias" variant="contained">
          Categorías
        </LinkButton>
        <LinkButton href="/admin/negocios" variant="contained">
          Negocios
        </LinkButton>
        <LinkButton href="/admin/productos" variant="contained">
          Productos
        </LinkButton>
        {showUsuarios && (
          <LinkButton href="/admin/usuarios" variant="contained" color="secondary">
            Usuarios
          </LinkButton>
        )}
      </Box>
    </Box>
  );
}
