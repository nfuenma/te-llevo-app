import type {
  Category,
  Business,
  Product,
  User,
  Region,
  ProductCategory,
  Prisma,
} from '@prisma/client';
import type {
  PaginatedResult,
  PaginationMeta,
  ListPaginationParams,
} from '@/lib/api/pagination';

// Re-export base Prisma types
export type { Category, Business, Product, User, Region, ProductCategory };
export type { PaginatedResult, PaginationMeta, ListPaginationParams };

export type ProductCategoryWithBusiness = ProductCategory;

// Extended types for API responses with relations or counts
export type RegionWithCategories = Region & {
  categories: { category: { id: string; name: string; image?: string | null } }[];
  _count?: { categories: number };
};

export type CategoryWithCount = Category & {
  _count: { businesses: number };
  regions?: { region: { id: string; name: string } }[];
};

export type BusinessWithRelations = Business & {
  categories: { category: { id: string; name: string } }[];
  _count?: { products: number };
  products?: Product[];
};

export type ProductWithBusiness = Product & {
  business: { id: string; name: string; slug: string };
  categories?: { category: { id: string; name: string } }[];
  productCategories?: { productCategory: { id: string; name: string } }[];
};

/** User with roles and businesses (for admin management). */
export type UserWithRolesAndBusinesses = Pick<
  User,
  'id' | 'name' | 'lastname' | 'email' | 'image' | 'createdAt'
> & {
  roles: { role: { id: string; name: string } }[];
  businessAdmins: { business: { id: string; name: string; slug: string } }[];
};

// Input types for create/update (optional fields)
export type CategoryCreateInput = Prisma.CategoryCreateInput;
export type CategoryUpdateInput = Prisma.CategoryUpdateInput;
export type BusinessCreateInput = Prisma.BusinessCreateInput;
export type BusinessUpdateInput = Prisma.BusinessUpdateInput;
export type ProductCreateInput = Prisma.ProductCreateInput;
export type ProductUpdateInput = Prisma.ProductUpdateInput;
export type RegionCreateInput = Prisma.RegionCreateInput;
export type RegionUpdateInput = Prisma.RegionUpdateInput;
