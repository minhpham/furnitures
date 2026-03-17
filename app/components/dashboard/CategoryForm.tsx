'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  useCreateCategory,
  useUpdateCategory,
  type Category,
  type CategoryFormValues,
  EMPTY_CATEGORY_FORM,
  categoryToForm,
} from '@/hooks/use-categories';
import { ApiError } from '@/lib/api';

// ── Schema ────────────────────────────────────────────────────────────────────

const schema: yup.ObjectSchema<CategoryFormValues> = yup.object({
  name: yup.string().trim().required('Category name is required'),
  description: yup.string().default(''),
});

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  category?: Category;
}

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const isEditing = Boolean(category);
  const [apiError, setApiError] = useState<string | null>(null);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(category?.id ?? '');
  const mutation = isEditing ? updateCategory : createCategory;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(schema),
    defaultValues: category ? categoryToForm(category) : EMPTY_CATEGORY_FORM,
  });

  const onSubmit: SubmitHandler<CategoryFormValues> = async (values) => {
    setApiError(null);
    try {
      await mutation.mutateAsync(values);
      router.push('/dashboard/categories');
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    }
  };

  const isPending = mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-[#EEEEEE]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/categories"
            className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-black hover:bg-[#F0F0F0] transition-colors rounded-sm"
            aria-label="Back to categories"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1
              className="text-2xl text-black"
              style={{ fontFamily: "Instrument Serif", fontStyle: "italic" }}
            >
              {isEditing ? "Edit Category" : "New Category"}
            </h1>
            <p className="text-xs text-[#888888] mt-0.5" style={{ fontFamily: "Inter" }}>
              {isEditing ? `Editing "${category!.name}"` : "Create a new product category"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/categories"
            className="h-9 px-5 border border-[#DDDDDD] text-sm text-[#333333] hover:bg-[#F5F5F5] transition-colors flex items-center"
            style={{ fontFamily: "Inter" }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending || (isEditing && !isDirty)}
            className="h-9 px-5 bg-black text-white text-sm font-medium hover:bg-[#111111] transition-colors disabled:opacity-50 flex items-center gap-2"
            style={{ fontFamily: "Inter" }}
          >
            {isPending ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                {isEditing ? "Saving…" : "Creating…"}
              </>
            ) : (
              isEditing ? "Save Changes" : "Create Category"
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 py-8 bg-[#F5F5F5]">
        <div className="max-w-2xl mx-auto">
          {/* API error */}
          {apiError && (
            <div
              className="mb-6 px-4 py-3 border border-red-200 bg-red-50 text-sm text-red-700 rounded-sm"
              style={{ fontFamily: "Inter" }}
            >
              {apiError}
            </div>
          )}

          {/* Category details card */}
          <div
            className="bg-white border border-[#EEEEEE] p-6"
            style={{ boxShadow: "inset 0 1px 0 0 rgba(0,0,0,0.03)" }}
          >
            <h2
              className="text-base font-medium text-black mb-5"
              style={{ fontFamily: "Inter" }}
            >
              Category Details
            </h2>

            <div className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-[#555555] mb-1.5"
                  style={{ fontFamily: "Inter" }}
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Living Room, Bedroom…"
                  className="w-full h-10 px-4 border border-[#DDDDDD] bg-white text-sm text-black placeholder:text-[#AAAAAA] focus:outline-none focus:border-black transition-colors"
                  style={{ fontFamily: "Inter" }}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600" style={{ fontFamily: "Inter" }}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-[#555555] mb-1.5"
                  style={{ fontFamily: "Inter" }}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  placeholder="A short description of this category…"
                  className="w-full px-4 py-3 border border-[#DDDDDD] bg-white text-sm text-black placeholder:text-[#AAAAAA] focus:outline-none focus:border-black transition-colors resize-none"
                  style={{ fontFamily: "Inter" }}
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-red-600" style={{ fontFamily: "Inter" }}>
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
