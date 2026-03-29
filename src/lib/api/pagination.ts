/**
 * Paginación offset (`page` + `pageSize`) para APIs list.
 * Query: `?page=1&pageSize=20` (ambos opcionales; hay valores por defecto y tope).
 */

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
/** Tope de ítems por página (evita abusos). */
export const MAX_PAGE_SIZE = 100;
/**
 * Tamaño por defecto en hooks de catálogo cuando no se pasa `pageSize`,
 * para seguir cargando listas pequeñas en una sola solicitud (≤ MAX_PAGE_SIZE).
 */
export const LIST_DEFAULT_PAGE_SIZE = 100;

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type ListPaginationParams = {
  page?: number;
  pageSize?: number;
};

export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
} {
  const pageRaw = searchParams.get('page');
  const pageSizeRaw = searchParams.get('pageSize');
  let page = pageRaw != null ? Number.parseInt(pageRaw, 10) : DEFAULT_PAGE;
  let pageSize =
    pageSizeRaw != null ? Number.parseInt(pageSizeRaw, 10) : DEFAULT_PAGE_SIZE;
  if (!Number.isFinite(page) || page < 1) page = DEFAULT_PAGE;
  if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = DEFAULT_PAGE_SIZE;
  pageSize = Math.min(pageSize, MAX_PAGE_SIZE);
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip, take: pageSize };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages =
    total === 0 ? 0 : Math.ceil(total / pageSize);
  return {
    items,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

/** Query `page` + `pageSize` para listar en cliente (pageSize alto por defecto). */
export function applyListPaginationToSearchParams(
  searchParams: URLSearchParams,
  pagination?: ListPaginationParams
): void {
  const page = pagination?.page ?? DEFAULT_PAGE;
  const pageSize = pagination?.pageSize ?? LIST_DEFAULT_PAGE_SIZE;
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));
}
