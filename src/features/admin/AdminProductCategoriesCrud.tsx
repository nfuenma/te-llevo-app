'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useBusinesses, useProductCategories } from '@/contexts';
import type { ProductCategory } from '@/lib/sdk/types';

type FormState = {
  id: string | null;
  businessId: string;
  name: string;
  image: string;
};

const emptyForm: FormState = {
  id: null,
  businessId: '',
  name: '',
  image: '',
};

export function AdminProductCategoriesCrud() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [pickedBusinessId, setPickedBusinessId] = useState<string | undefined>(undefined);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { setListParams: setBusinessesListParams, items: businesses, isLoading: loadingBusinesses } =
    useBusinesses();
  const selectedBusinessId = pickedBusinessId ?? businesses?.[0]?.id ?? '';
  const {
    setListBusinessId,
    items: productCategories,
    isLoading: loadingCategories,
    createProductCategory: createMutation,
    updateProductCategory: updateMutation,
    deleteProductCategory: deleteMutation,
  } = useProductCategories();

  useLayoutEffect(() => {
    setBusinessesListParams(undefined);
    return () => setBusinessesListParams(undefined);
  }, [setBusinessesListParams]);

  useEffect(() => {
    setListBusinessId(selectedBusinessId || null);
    return () => setListBusinessId(null);
  }, [selectedBusinessId, setListBusinessId]);

  const handleOpenCreate = () => {
    setForm({
      ...emptyForm,
      businessId: selectedBusinessId || (businesses?.[0]?.id ?? ''),
    });
    setOpen(true);
  };

  const handleOpenEdit = (row: ProductCategory) => {
    setForm({
      id: row.id,
      businessId: row.businessId,
      name: row.name,
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
    const businessId = form.businessId.trim();
    if (!name || !businessId) return;

    if (form.id) {
      await updateMutation.mutateAsync({
        id: form.id,
        name,
        image: form.image.trim() || undefined,
      });
    } else {
      await createMutation.mutateAsync({
        businessId,
        name,
        image: form.image.trim() || undefined,
      });
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('¿Eliminar esta categoría de producto?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isLoading = loadingBusinesses;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>Negocio</InputLabel>
          <Select
            value={selectedBusinessId}
            label="Negocio"
            onChange={(e) => setPickedBusinessId(e.target.value)}
          >
            {businesses?.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          disabled={!selectedBusinessId}
        >
          Nueva categoría de producto
        </Button>
      </Box>
      {!businesses?.length && (
        <Box sx={{ py: 2 }}>
          <Button variant="outlined" component="a" href="/admin/negocios">
            Crear primero un negocio
          </Button>
        </Box>
      )}
      {selectedBusinessId && (
        <>
          {loadingCategories ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : isMobile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {productCategories?.map((row) => (
                <Card key={row.id} variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 1 } }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {row.name}
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
                    <TableCell align="right" width={120}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productCategories?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
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
          {productCategories?.length === 0 && !loadingCategories && (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCreate}>
                Crear primera categoría de producto
              </Button>
            </Box>
          )}
        </>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? 'Editar categoría de producto' : 'Nueva categoría de producto'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Negocio</InputLabel>
            <Select
              value={form.businessId}
              label="Negocio"
              onChange={(e) => setForm((f) => ({ ...f, businessId: e.target.value }))}
              disabled={!!form.id}
            >
              {businesses?.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus={!!form.id}
            margin="dense"
            label="Nombre"
            fullWidth
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.name.trim() || !form.businessId || isSubmitting}
          >
            {form.id ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
