'use client';

import { useLayoutEffect, useState } from 'react';
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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import { useUsers, useRoles, useBusinesses, type RoleOption } from '@/contexts';
import type { UserWithRolesAndBusinesses } from '@/lib/sdk/types';

export function AdminUsuariosCrud() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRolesAndBusinesses | null>(null);
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [businessIds, setBusinessIds] = useState<string[]>([]);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [roleForm, setRoleForm] = useState<{ id: string | null; name: string }>({
    id: null,
    name: '',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    setListParams: setUsersListParams,
    items: users,
    isLoading,
    updateUser: updateMutation,
  } = useUsers();
  const {
    setListParams: setRolesListParams,
    items: roles,
    createRole: createRoleMutation,
    updateRole: updateRoleMutation,
    deleteRole: deleteRoleMutation,
  } = useRoles();
  const { setListParams: setBusinessesListParams, items: businesses } = useBusinesses();

  useLayoutEffect(() => {
    setUsersListParams(undefined);
    return () => setUsersListParams(undefined);
  }, [setUsersListParams]);

  useLayoutEffect(() => {
    setRolesListParams(undefined);
    return () => setRolesListParams(undefined);
  }, [setRolesListParams]);

  useLayoutEffect(() => {
    setBusinessesListParams(undefined);
    return () => setBusinessesListParams(undefined);
  }, [setBusinessesListParams]);

  const handleOpenEdit = (user: UserWithRolesAndBusinesses) => {
    setSelectedUser(user);
    setRoleIds(user.roles?.map((r) => r.role.id) ?? []);
    setBusinessIds(user.businessAdmins?.map((ba) => ba.business.id) ?? []);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setRoleIds([]);
    setBusinessIds([]);
  };

  const handleToggleRole = (roleId: string) => {
    setRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    await updateMutation.mutateAsync({
      id: selectedUser.id,
      roleIds,
      businessIds,
    });
    handleClose();
  };

  const handleOpenCreateRole = () => {
    setRoleForm({ id: null, name: '' });
    setOpenRoleDialog(true);
  };

  const handleOpenEditRole = (role: RoleOption) => {
    setRoleForm({ id: role.id, name: role.name });
    setOpenRoleDialog(true);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
    setRoleForm({ id: null, name: '' });
  };

  const handleSubmitRole = async () => {
    const name = roleForm.name.trim();
    if (!name) return;
    if (roleForm.id) {
      await updateRoleMutation.mutateAsync({ id: roleForm.id, name });
    } else {
      await createRoleMutation.mutateAsync({ name });
    }
    handleCloseRoleDialog();
  };

  const handleDeleteRole = async (role: RoleOption) => {
    if (typeof window !== 'undefined' && !window.confirm(`¿Eliminar el rol "${role.name}"?`)) return;
    await deleteRoleMutation.mutateAsync(role.id);
  };

  const isSubmitting = updateMutation.isPending;
  const isRoleSubmitting =
    createRoleMutation.isPending || updateRoleMutation.isPending;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Accordion variant="outlined" sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Gestionar roles del sistema</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateRole}
            >
              Nuevo rol
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="right" width={100}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles?.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditRole(role)}
                        aria-label="Editar rol"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteRole(role)}
                        aria-label="Eliminar rol"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {roles?.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No hay roles. Crea uno con «Nuevo rol».
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {users?.map((user) => (
            <Card key={user.id} variant="outlined">
              <CardContent sx={{ '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Avatar
                    src={user.image ?? undefined}
                    sx={{ width: 40, height: 40 }}
                  >
                    {user.name?.charAt(0) ?? user.email?.charAt(0) ?? '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {[user.name, user.lastname].filter(Boolean).join(' ') || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Roles: {user.roles?.length ? user.roles.map((r) => r.role.name).join(', ') : '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Negocios: {user.businessAdmins?.length ? user.businessAdmins.map((ba) => ba.business.name).join(', ') : '—'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <IconButton
                  size="small"
                  onClick={() => handleOpenEdit(user)}
                  aria-label="Editar roles y negocios"
                >
                  <EditIcon fontSize="small" />
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
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Negocios</TableCell>
                <TableCell align="right" width={80}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={user.image ?? undefined}
                        sx={{ width: 32, height: 32 }}
                      >
                        {user.name?.charAt(0) ?? user.email?.charAt(0) ?? '?'}
                      </Avatar>
                      <Typography variant="body2">
                        {[user.name, user.lastname].filter(Boolean).join(' ') || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles?.length
                      ? user.roles.map((r) => r.role.name).join(', ')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {user.businessAdmins?.length
                      ? user.businessAdmins.map((ba) => ba.business.name).join(', ')
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(user)}
                      aria-label="Editar roles y negocios"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {users?.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
          No hay usuarios (los usuarios aparecen al iniciar sesión con Google).
        </Typography>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Asignar roles y negocios — {selectedUser ? [selectedUser.name, selectedUser.lastname].filter(Boolean).join(' ') || selectedUser.email : ''}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <FormControl component="fieldset">
                <Typography variant="subtitle2" gutterBottom>
                  Roles
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Marca uno o más roles para este usuario (superadmin, admin, business, client).
                </Typography>
                <FormGroup row>
                  {roles?.map((role) => (
                    <FormControlLabel
                      key={role.id}
                      control={
                        <Checkbox
                          checked={roleIds.includes(role.id)}
                          onChange={() => handleToggleRole(role.id)}
                        />
                      }
                      label={role.name}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              <Typography variant="body2" color="text.secondary">
                Usuario: {selectedUser.email}
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Negocios que puede gestionar</InputLabel>
                <Select
                  multiple
                  value={businessIds}
                  label="Negocios que puede gestionar"
                  onChange={(e) => setBusinessIds(e.target.value as string[])}
                  renderValue={(selected) =>
                    businesses
                      ?.filter((b) => selected.includes(b.id))
                      .map((b) => b.name)
                      .join(', ') ?? ''
                  }
                >
                  {businesses?.map((b) => (
                    <MenuItem key={b.id} value={b.id}>
                      <Checkbox checked={businessIds.includes(b.id)} />
                      <ListItemText primary={b.name} secondary={b.slug} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary">
                Los roles admin y business pueden gestionar los negocios que selecciones aquí. Si no asignas negocios, un usuario business no podrá gestionar ninguno.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{roleForm.id ? 'Editar rol' : 'Nuevo rol'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            value={roleForm.name}
            onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmitRole}
            variant="contained"
            disabled={isRoleSubmitting || !roleForm.name.trim()}
          >
            {roleForm.id ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
