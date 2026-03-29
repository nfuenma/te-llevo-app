'use client';

import { useState } from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  useListCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/api/categories';
import type { CategoryWithCount } from '@/lib/sdk/types';

type FormState = { id: string | null; name: string; tags: string; image: string };

const emptyForm: FormState = { id: null, name: '', tags: '', image: '' };

function tagsStringToArray(s: string): string[] {
  return s
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function AdminCategoriesCrud() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: categoriesPage, isLoading } = useListCategories();
  const categories = categoriesPage?.items;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const handleOpenEdit = (row: CategoryWithCount) => {
    setForm({
      id: row.id,
      name: row.name,
      tags: row.tags?.join(', ') ?? '',
      image: row.image ?? '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    const name = form.name.trim();
    if (!name) return;
    const tags = tagsStringToArray(form.tags);
    const image = form.image.trim() || undefined;

    if (form.id) {
      await updateMutation.mutateAsync({ id: form.id, name, tags, image });
    } else {
      await createMutation.mutateAsync({ name, tags, image });
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('¿Eliminar esta categoría?')) return;
    await deleteMutation.mutateAsync(id);
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Nueva categoría
        </Button>
      </Box>
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {categories?.map((row) => (
            <Card key={row.id} variant="outlined">
              <CardContent sx={{ '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {row.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.tags?.slice(0, 3).join(', ') ?? '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Negocios: {row._count?.businesses ?? 0}
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
                <TableCell>Tags</TableCell>
                <TableCell align="right">Negocios</TableCell>
                <TableCell align="right" width={120}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.tags?.slice(0, 3).join(', ') ?? '—'}</TableCell>
                  <TableCell align="right">{row._count?.businesses ?? 0}</TableCell>
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
      {categories?.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
          No hay categorías. Crea una con el botón «Nueva categoría».
        </Typography>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Tags (separados por coma)"
            fullWidth
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="URL imagen"
            fullWidth
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!form.name.trim() || isSubmitting}>
            {form.id ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
