'use client';

import { useRef, useState, type ChangeEvent } from 'react';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import {
  useListRegions,
  useCreateRegion,
  useUpdateRegion,
  useDeleteRegion,
} from '@/hooks/api/regions';
import { useListCategories } from '@/hooks/api/categories';
import type { RegionWithCategories } from '@/lib/sdk/types';
import { apiConfig } from '@/lib/sdk/config';

type FormState = {
  id: string | null;
  name: string;
  image: string;
  categoryIds: string[];
};

const emptyForm: FormState = { id: null, name: '', image: '', categoryIds: [] };

export function AdminRegionesCrud() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: regions, isLoading } = useListRegions();
  const { data: categories } = useListCategories();
  const createMutation = useCreateRegion();
  const updateMutation = useUpdateRegion();
  const deleteMutation = useDeleteRegion();

  const uploadUrl = `${apiConfig.baseUrl}/api/upload/regions`;

  const handlePickImage = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    setUploadLoading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body,
        credentials: 'include',
      });
      let data: { url?: string; error?: string } = {};
      try {
        data = (await res.json()) as { url?: string; error?: string };
      } catch {
        /* vacío */
      }
      if (!res.ok) {
        setUploadError(data.error ?? 'No se pudo subir la imagen');
        return;
      }
      const url = data.url;
      if (url) {
        setForm((f) => ({ ...f, image: url }));
      }
    } catch {
      setUploadError('Error de red al subir la imagen');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setUploadError(null);
    setOpen(true);
  };

  const handleOpenEdit = (row: RegionWithCategories) => {
    setUploadError(null);
    setForm({
      id: row.id,
      name: row.name,
      image: row.image ?? '',
      categoryIds: row.categories?.map((c) => c.category.id) ?? [],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
    setUploadError(null);
    setUploadLoading(false);
  };

  const handleSubmit = async () => {
    const name = form.name.trim();
    if (!name) return;
    const image = form.image.trim() || undefined;
    // Al crear: solo enviar categoryIds si hay alguna. Al editar: siempre enviar para poder vaciar.
    const categoryIds =
      form.id !== null ? form.categoryIds : form.categoryIds.length ? form.categoryIds : undefined;

    if (form.id) {
      await updateMutation.mutateAsync({ id: form.id, name, image, categoryIds });
    } else {
      await createMutation.mutateAsync({ name, image, categoryIds });
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('¿Eliminar esta región?')) return;
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Nueva región
        </Button>
      </Box>
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {regions?.map((row) => (
            <Card key={row.id} variant="outlined">
              <CardContent sx={{ '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  {row.image ? (
                    <Box
                      component="img"
                      src={row.image}
                      alt=""
                      sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                    />
                  ) : null}
                  <Typography variant="subtitle1" fontWeight="medium">
                    {row.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {row.categories?.length
                    ? row.categories.map((rc) => rc.category.name).join(', ')
                    : 'Sin categorías'}
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
                <TableCell>Imagen</TableCell>
                <TableCell>Categorías</TableCell>
                <TableCell align="right" width={120}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {regions?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {row.image ? (
                      <Box
                        component="img"
                        src={row.image}
                        alt=""
                        sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    {row.categories?.length
                      ? row.categories.map((rc) => rc.category.name).join(', ')
                      : '—'}
                  </TableCell>
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
      {regions?.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
          No hay regiones. Crea una con el botón «Nueva región».
        </Typography>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? 'Editar región' : 'Nueva región'}</DialogTitle>
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            onChange={handleFileChange}
          />
          <TextField
            margin="dense"
            label="URL imagen"
            fullWidth
            placeholder="https://... o sube un archivo"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            helperText="Puedes pegar una URL o subir una foto: se optimiza (máx. 200 KB) y se guarda en Cloudinary."
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudUploadIcon />}
              onClick={handlePickImage}
              disabled={uploadLoading}
            >
              {uploadLoading ? 'Optimizando y subiendo…' : 'Subir desde el dispositivo'}
            </Button>
            {form.image ? (
              <Box
                component="img"
                src={form.image}
                alt=""
                sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1, border: 1, borderColor: 'divider' }}
              />
            ) : null}
          </Box>
          {uploadError ? (
            <Alert severity="error" sx={{ mt: 1.5 }} onClose={() => setUploadError(null)}>
              {uploadError}
            </Alert>
          ) : null}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Categorías de la región
            </Typography>
            {categories && categories.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay categorías. Crea categorías en la sección <strong>Categorías</strong> del menú y luego asígnalas aquí.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.name.trim() || isSubmitting}
          >
            {form.id ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
