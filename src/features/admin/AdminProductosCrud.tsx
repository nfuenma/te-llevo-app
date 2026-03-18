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
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/api/products';
import { useListBusinesses } from '@/hooks/api/businesses';
import { useListProductCategories } from '@/hooks/api/product-categories';
import type { ProductWithBusiness } from '@/lib/sdk/types';

type FormState = {
  id: string | null;
  businessId: string;
  name: string;
  description: string;
  price: string;
  image: string;
  productCategoryIds: string[];
};

const emptyForm: FormState = {
  id: null,
  businessId: '',
  name: '',
  description: '',
  price: '',
  image: '',
  productCategoryIds: [],
};

export function AdminProductosCrud() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: products, isLoading } = useListProducts();
  const { data: businesses } = useListBusinesses();
  const { data: productCategories } = useListProductCategories(form.businessId || null);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleOpenCreate = () => {
    setForm({
      ...emptyForm,
      businessId: businesses?.[0]?.id ?? '',
    });
    setOpen(true);
  };

  const handleOpenEdit = (row: ProductWithBusiness) => {
    setForm({
      id: row.id,
      businessId: row.business?.id ?? '',
      name: row.name,
      description: row.description ?? '',
      price: row.price != null ? String(row.price) : '',
      image: row.image ?? '',
      productCategoryIds: row.productCategories?.map((pc) => pc.productCategory.id) ?? [],
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

    const payload = {
      businessId,
      name,
      description: form.description.trim() || undefined,
      price: form.price.trim() ? form.price.trim() : undefined,
      image: form.image.trim() || undefined,
      productCategoryIds: form.productCategoryIds.length ? form.productCategoryIds : undefined,
    };

    if (form.id) {
      await updateMutation.mutateAsync({
        id: form.id,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        image: payload.image,
        productCategoryIds: payload.productCategoryIds,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('¿Eliminar este producto?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const toggleProductCategory = (productCategoryId: string) => {
    setForm((f) => ({
      ...f,
      productCategoryIds: f.productCategoryIds.includes(productCategoryId)
        ? f.productCategoryIds.filter((id) => id !== productCategoryId)
        : [...f.productCategoryIds, productCategoryId],
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          disabled={!businesses?.length}
        >
          Nuevo producto
        </Button>
      </Box>
      {!businesses?.length && (
        <Box sx={{ py: 2 }}>
          <Button variant="outlined" component="a" href="/admin/negocios">
            Crear primero un negocio
          </Button>
        </Box>
      )}
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {products?.map((row) => (
            <Card key={row.id} variant="outlined">
              <CardContent sx={{ '&:last-child': { pb: 1 } }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {row.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.business?.name ?? '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: {row.price != null ? String(row.price) : '—'}
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
                <TableCell>Negocio</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right" width={120}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.business?.name ?? '—'}</TableCell>
                  <TableCell align="right">{row.price != null ? String(row.price) : '—'}</TableCell>
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
      {products?.length === 0 && (businesses?.length ?? 0) > 0 && (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Crear primer producto
          </Button>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Negocio</InputLabel>
            <Select
              value={form.businessId}
              label="Negocio"
              onChange={(e) => setForm((f) => ({ ...f, businessId: e.target.value }))}
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
            label="Descripción"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Precio"
            fullWidth
            type="number"
            inputProps={{ step: 0.01, min: 0 }}
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="URL imagen"
            fullWidth
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          />
          {productCategories && productCategories.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Categorías del negocio
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {productCategories.map((pc) => (
                  <Button
                    key={pc.id}
                    size="small"
                    variant={form.productCategoryIds.includes(pc.id) ? 'contained' : 'outlined'}
                    onClick={() => toggleProductCategory(pc.id)}
                  >
                    {pc.name}
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
            disabled={!form.name.trim() || !form.businessId || isSubmitting}
          >
            {form.id ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
