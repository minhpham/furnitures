'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormValues {
  name: string;
  description: string;
}

export const EMPTY_CATEGORY_FORM: CategoryFormValues = {
  name: '',
  description: '',
};

export function categoryToForm(c: Category): CategoryFormValues {
  return {
    name: c.name,
    description: c.description ?? '',
  };
}

// ── Query keys ────────────────────────────────────────────────────────────────

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeList(data: Category[] | { items: Category[] }): Category[] {
  return Array.isArray(data) ? data : (data.items ?? []);
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () =>
      api
        .get<Category[] | { items: Category[] }>('/api/v1/categories')
        .then(normalizeList),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => api.get<Category>(`/api/v1/categories/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CategoryFormValues) =>
      api.post<Category>('/api/v1/categories', {
        name: values.name,
        description: values.description || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CategoryFormValues) =>
      api.patch<Category>(`/api/v1/categories/${id}`, {
        name: values.name,
        description: values.description || null,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(categoryKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/api/v1/categories/${id}`),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}
