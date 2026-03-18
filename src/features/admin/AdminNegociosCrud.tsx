'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  useListBusinesses,
  useCreateBusiness,
  useUpdateBusiness,
  useDeleteBusiness,
} from '@/hooks/api/businesses';
import { useListCategories as useCategoriesList } from '@/hooks/api/categories';
import { canCreateBusiness } from '@/lib/auth/roles';
import type { BusinessWithRelations } from '@/lib/sdk/types';

type FormState = {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  address: string;
  image: string;
  categoryIds: string[];
};

const emptyForm: FormState = {
  id: null,
  name: '',
  slug: '',
  description: '',
  address: '',
  image: '',
  categoryIds: [],
};

export function AdminNegociosCrud() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showCreateButton = canCreateBusiness(session?.user?.roles);

  const { data: businesses, isLoading } = useListBusinesses();
  const { data: categories } = useCategoriesList();
  const createMutation = useCreateBusiness();
  const updateMutation = useUpdateBusiness();
  const deleteMutation = useDeleteBusiness();

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const handleOpenEdit = (row: BusinessWithRelations) => {
    setForm({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? '',
      address: row.address ?? '',
      image: row.image ?? '',
      categoryIds: row.categories?.map((c) => c.category.id) ?? [],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
  };

  const slugFromName = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const handleSubmit = async () => {
    const name = form.name.trim();
    const slug = form.slug.trim() || slugFromName(form.name);
    if (!name || !slug) return;

    const payload = {
      name,
      slug,
      description: form.description.trim() || undefined,
      address: form.address.trim() || undefined,
      image: form.image.trim() || undefined,
      categoryIds: form.categoryIds.length ? form.categoryIds : undefined,
    };

    if (form.id) {
      await updateMutation.mutateAsync({ id: form.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('¿Eliminar este negocio?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const toggleCategory = (categoryId: string) => {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(categoryId)
        ? f.categoryIds.filter((c) => c !== categoryId)
        : [...f.categoryIds, categoryId],
    }));
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {showCreateButton && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Nuevo negocio
          </Button>
        </Box>
      )}
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {businesses?.map((row) => (
            <Card key={row.id} variant="outlined">
              <CardContent sx={{ '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {row.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.slug}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Productos: {row._count?.products ?? 0}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <IconButton size="small" onClick={() => handleOpenEdit(row)} aria-label="Editar">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row.id)}
                  aria-label="Eliminar"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="right">Productos</TableCell>
                <TableCell align="right" width={120}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businesses?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.slug}</TableCell>
                  <TableCell align="right">{row._count?.products ?? 0}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(row)} aria-label="Editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                      aria-label="Eliminar"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {businesses?.length === 0 && showCreateButton && (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Crear primer negocio
          </Button>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? 'Editar negocio' : 'Nuevo negocio'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            required
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: f.id ? f.slug : (f.slug || slugFromName(f.name)) ? f.slug : slugFromName(e.target.value),
              }))
            }
          />
          <TextField
            margin="dense"
            label="Slug"
            fullWidth
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Dirección"
            fullWidth
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="URL imagen"
            fullWidth
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          />
          {categories && categories.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Categorías
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    size="small"
                    variant={form.categoryIds.includes(cat.id) ? 'contained' : 'outlined'}
                    onClick={() => toggleCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.name.trim() || !form.slug.trim() || isSubmitting}
          >
            {form.id ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
