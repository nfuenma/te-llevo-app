/**
 * Role names in the system. Must match Role.name in DB (seed).
 */
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  BUSINESS: 'business',
  CLIENT: 'client',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const DEFAULT_ROLE = ROLES.CLIENT;

/** Roles that can access the admin panel (any section). */
export const ADMIN_PANEL_ROLES: RoleName[] = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.BUSINESS];

/** Roles that can manage regions and categories (full catalog config). */
export const CATALOG_ADMIN_ROLES: RoleName[] = [ROLES.SUPERADMIN, ROLES.ADMIN];

/** Only superadmin can create new businesses. */
export const BUSINESS_CREATOR_ROLES: RoleName[] = [ROLES.SUPERADMIN];

export function hasRole(userRoles: string[] | undefined, role: RoleName): boolean {
  return Array.isArray(userRoles) && userRoles.includes(role);
}

export function hasAnyRole(userRoles: string[] | undefined, roles: RoleName[]): boolean {
  return Array.isArray(userRoles) && roles.some((r) => userRoles.includes(r));
}

export function canAccessAdminPanel(userRoles: string[] | undefined): boolean {
  return hasAnyRole(userRoles, ADMIN_PANEL_ROLES);
}

/** Solo superadmin puede gestionar usuarios y asignar roles/negocios. */
export function isSuperadmin(userRoles: string[] | undefined): boolean {
  return hasRole(userRoles, ROLES.SUPERADMIN);
}

export function canManageCatalog(userRoles: string[] | undefined): boolean {
  return hasAnyRole(userRoles, CATALOG_ADMIN_ROLES);
}

export function canCreateBusiness(userRoles: string[] | undefined): boolean {
  return hasAnyRole(userRoles, BUSINESS_CREATOR_ROLES);
}

/** Superadmin can manage any business; admin/business only those in managedBusinessIds. */
export function canManageBusiness(
  userRoles: string[] | undefined,
  managedBusinessIds: string[] | undefined,
  businessId: string
): boolean {
  if (hasRole(userRoles, ROLES.SUPERADMIN)) return true;
  return Array.isArray(managedBusinessIds) && managedBusinessIds.includes(businessId);
}

/** Superadmin can manage any product; admin/business only in their managed businesses. */
export function canManageProduct(
  userRoles: string[] | undefined,
  managedBusinessIds: string[] | undefined,
  businessId: string
): boolean {
  return canManageBusiness(userRoles, managedBusinessIds, businessId);
}
