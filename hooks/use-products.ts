'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  /** Group name displayed to the customer, e.g. "Color", "Size", "Material" */
  label: string;
  /** Option value, e.g. "Natural Oak", "Large", "#8B6914" */
  value: string;
  /** Amount added to (or subtracted from) the base price; null = no modifier */
  priceModifier: number | null;
  /** Variant-specific stock; null = use the product-level stock */
  stock: number | null;
  /** Variant-specific SKU; null = use the product SKU */
  sku: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  discountPrice: string | number | null;
  stock: number;
  sku: string;
  thumbnail: string | null;
  images: string[] | null;
  material: string | null;
  color: string | null;
  dimensions: string | null;
  weight: number | null;
  isActive: boolean;
  categories: { id: string; name: string }[] | null;
  /** Legacy single-category field — kept for display compatibility */
  category?: { id: string; name: string } | null;
  variants?: ProductVariant[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  sku: string;
  material: string;
  color: string;
  dimensions: string;
  weight: string;
  categoryIds: string[];
  isActive: boolean;
}

export const EMPTY_FORM: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '0',
  sku: '',
  material: '',
  color: '',
  dimensions: '',
  weight: '',
  categoryIds: [],
  isActive: true,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export function productToForm(p: Product): ProductFormValues {
  // Prefer `categories` array; fall back to legacy `category` for compatibility
  const categoryIds =
    p.categories && p.categories.length > 0
      ? p.categories.map((c) => c.id)
      : p.category
        ? [p.category.id]
        : [];

  return {
    name: p.name,
    description: p.description ?? '',
    price: String(p.price),
    discountPrice: p.discountPrice != null ? String(p.discountPrice) : '',
    stock: String(p.stock ?? 0),
    sku: p.sku ?? '',
    material: p.material ?? '',
    color: p.color ?? '',
    dimensions: p.dimensions ?? '',
    weight: p.weight != null ? String(p.weight) : '',
    categoryIds,
    isActive: p.isActive ?? true,
  };
}

export function buildProductPayload(values: ProductFormValues) {
  return {
    name: values.name,
    description: values.description,
    price: Number(values.price),
    discountPrice: values.discountPrice ? Number(values.discountPrice) : null,
    stock: Number(values.stock),
    sku: values.sku,
    material: values.material || null,
    color: values.color || null,
    dimensions: values.dimensions || null,
    weight: values.weight ? Number(values.weight) : null,
    categoryIds: values.categoryIds,
    isActive: values.isActive,
  };
}

// ── Query keys ────────────────────────────────────────────────────────────────

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useProducts(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => api.get<Product[]>('/api/v1/products'),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => api.get<Product>(`/api/v1/products/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: FormData | ProductFormValues) =>
      values instanceof FormData
        ? api.upload<Product>('/api/v1/products', values)
        : api.post<Product>('/api/v1/products', buildProductPayload(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: FormData | ProductFormValues) =>
      values instanceof FormData
        ? api.uploadPatch<Product>(`/api/v1/products/${id}`, values)
        : api.patch<Product>(`/api/v1/products/${id}`, buildProductPayload(values)),
    onSuccess: (updated) => {
      queryClient.setQueryData(productKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<void>(`/api/v1/products/${id}`),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// ── Variant hooks ─────────────────────────────────────────────────────────────

export function useProductVariants(productId: string) {
  return useQuery({
    queryKey: [...productKeys.detail(productId), 'variants'] as const,
    queryFn: () => api.get<ProductVariant[]>(`/api/v1/products/${productId}/variants`),
    enabled: Boolean(productId),
  });
}

export function useCreateVariant(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ProductVariant, 'id'>) =>
      api.post<ProductVariant>(`/api/v1/products/${productId}/variants`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}

export function useDeleteVariant(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) =>
      api.delete<void>(`/api/v1/products/${productId}/variants/${variantId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}
