'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
import Avatar from '@mui/material/Avatar';
import { useListUsers, useUpdateUser } from '@/hooks/api/users';
import { useListRoles } from '@/hooks/api/roles';
import { useListBusinesses } from '@/hooks/api/businesses';
import type { UserWithRolesAndBusinesses } from '@/lib/sdk/types';

export function AdminUsuariosCrud() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRolesAndBusinesses | null>(null);
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [businessIds, setBusinessIds] = useState<string[]>([]);

  const { data: users, isLoading } = useListUsers();
  const { data: roles } = useListRoles();
  const { data: businesses } = useListBusinesses();
  const updateMutation = useUpdateUser();

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

  const isSubmitting = updateMutation.isPending;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
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
      {users?.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
          No hay usuarios (los usuarios aparecen al iniciar sesión con Google).
        </Typography>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar usuario {selectedUser ? [selectedUser.name, selectedUser.lastname].filter(Boolean).join(' ') || selectedUser.email : ''}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedUser.email}
              </Typography>
              <FormControl component="fieldset">
                <Typography variant="subtitle2" gutterBottom>
                  Roles
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
    </>
  );
}
