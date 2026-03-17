'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  useCreateProduct,
  useUpdateProduct,
  type Product,
  type ProductFormValues,
  EMPTY_FORM,
  productToForm,
} from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { ApiError } from '@/lib/api';
import { VariantManager } from './VariantManager';

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGE_COUNT = 10;

// ── Form value types ──────────────────────────────────────────────────────────

/**
 * Extended form values that include the file upload fields on top of the
 * existing ProductFormValues string/boolean fields.
 */
export interface ProductFormExtendedValues extends Omit<
  ProductFormValues,
  'categoryIds'
> {
  categoryIds: string[];
  thumbnail: File | null;
  images: File[];
}

// ── Yup schema ────────────────────────────────────────────────────────────────

const schema: yup.ObjectSchema<ProductFormExtendedValues> = yup.object({
  name: yup.string().trim().required('Product name is required'),
  description: yup.string().default(''),
  price: yup
    .string()
    .required('Price is required')
    .test('is-positive-number', 'Enter a valid price greater than 0', (v) => {
      const n = Number(v);
      return !isNaN(n) && n > 0;
    }),
  discountPrice: yup
    .string()
    .default('')
    .test(
      'is-valid-discount',
      'Enter a valid discount price',
      (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0),
    ),
  stock: yup
    .string()
    .required('Stock quantity is required')
    .test(
      'is-non-negative-int',
      'Enter a valid stock quantity',
      (v) => !isNaN(Number(v)) && Number(v) >= 0,
    ),
  sku: yup.string().trim().required('SKU is required'),
  material: yup.string().default(''),
  color: yup.string().default(''),
  dimensions: yup.string().default(''),
  weight: yup
    .string()
    .default('')
    .test(
      'is-valid-weight',
      'Enter a valid weight',
      (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0),
    ),
  categoryIds: yup.array(yup.string().required()).default([]),
  isActive: yup.boolean().required().default(true),

  // File upload fields (both optional — only sent when user selects files)
  thumbnail: yup
    .mixed<File>()
    .nullable()
    .optional()
    .test(
      'thumbnail-size',
      'Thumbnail must be smaller than 2 MB',
      (v) => !(v instanceof File) || v.size <= MAX_THUMBNAIL_SIZE,
    ),

  images: yup
    .array(
      yup
        .mixed<File>()
        .required()
        .test('is-file', 'Each item must be a file', (v) => v instanceof File)
        .test(
          'image-size',
          'Each image must be smaller than 5 MB',
          (v) => v instanceof File && v.size <= MAX_IMAGE_SIZE,
        ),
    )
    .optional()
    .max(MAX_IMAGE_COUNT, `Maximum ${MAX_IMAGE_COUNT} images allowed`),
}) as yup.ObjectSchema<ProductFormExtendedValues>;

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  product?: Product;
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const baseDefaults = product ? productToForm(product) : EMPTY_FORM;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormExtendedValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      ...baseDefaults,
      thumbnail: null,
      images: [],
    },
  });

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(product?.id ?? '');
  const mutation = isEdit ? updateMutation : createMutation;

  const apiError =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Something went wrong. Please try again.'
        : null;

  // ── Image preview state ──────────────────────────────────────────────────

  // Existing server URLs (shown in edit mode until replaced/removed)
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    product?.thumbnail ?? null,
  );
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images ?? [],
  );

  // New file previews (blob URLs created from newly selected files)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const prevThumbnailPreview = useRef<string | null>(null);
  const prevImagePreviews = useRef<string[]>([]);

  // Revoke thumbnail object URL when it changes
  useEffect(() => {
    const prev = prevThumbnailPreview.current;
    if (prev && prev !== thumbnailPreview) URL.revokeObjectURL(prev);
    prevThumbnailPreview.current = thumbnailPreview;
  }, [thumbnailPreview]);

  // Revoke image object URLs when they change
  useEffect(() => {
    const prev = prevImagePreviews.current;
    const next = new Set(imagePreviews);
    prev.forEach((url) => {
      if (!next.has(url)) URL.revokeObjectURL(url);
    });
    prevImagePreviews.current = imagePreviews;
  }, [imagePreviews]);

  // Revoke ALL object URLs on unmount
  useEffect(() => {
    return () => {
      if (prevThumbnailPreview.current)
        URL.revokeObjectURL(prevThumbnailPreview.current);
      prevImagePreviews.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleThumbnailChange(files: FileList | null) {
    if (!files || files.length === 0) {
      setValue('thumbnail', null, { shouldValidate: true });
      setThumbnailPreview(null);
      return;
    }
    const file = files[0];
    setValue('thumbnail', file, { shouldValidate: true });
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function handleImagesChange(files: FileList | null) {
    if (!files || files.length === 0) {
      setValue('images', [], { shouldValidate: true });
      setImagePreviews([]);
      return;
    }
    const fileArray = Array.from(files);
    setValue('images', fileArray, { shouldValidate: true });
    setImagePreviews(fileArray.map((f) => URL.createObjectURL(f)));
  }

  function removeThumbnail() {
    setValue('thumbnail', null, { shouldValidate: true });
    setThumbnailPreview(null);
    setExistingThumbnail(null);
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeImage(index: number) {
    const current = watch('images') ?? [];
    const next = current.filter((_, i) => i !== index);
    setValue('images', next, { shouldValidate: true });
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit: SubmitHandler<ProductFormExtendedValues> = (data) => {
    const { thumbnail, images, isActive, categoryIds, ...rest } = data;

    const fd = new FormData();
    fd.append('name', rest.name);
    fd.append('price', rest.price);
    if (rest.description) fd.append('description', rest.description);
    if (rest.discountPrice) fd.append('discountPrice', rest.discountPrice);
    if (rest.stock) fd.append('stock', rest.stock);
    if (rest.sku) fd.append('sku', rest.sku);
    if (rest.material) fd.append('material', rest.material);
    if (rest.color) fd.append('color', rest.color);
    if (rest.dimensions) fd.append('dimensions', rest.dimensions);
    if (rest.weight) fd.append('weight', rest.weight);
    if (categoryIds.length > 0) fd.append('categoryIds', categoryIds.join(','));
    fd.append('isActive', String(isActive));

    if (thumbnail instanceof File) fd.append('thumbnail', thumbnail);
    images?.forEach((img) => fd.append('images', img));

    mutation.mutate(fd, {
      onSuccess: () => router.push('/dashboard/products'),
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const isActive = watch('isActive');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='flex flex-col flex-1'>
      {/* Page header */}
      <div className='flex items-center justify-between px-8 py-5 bg-white border-b border-[#EEEEEE] flex-shrink-0'>
        <div className='flex items-center gap-4'>
          <Link
            href='/dashboard/products'
            className='w-8 h-8 flex items-center justify-center text-[#888888] hover:text-black hover:bg-[#F0F0F0] transition-colors rounded-sm'>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='m15 18-6-6 6-6' />
            </svg>
          </Link>
          <div>
            <h1
              className='text-2xl text-black'
              style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic' }}>
              {isEdit ? 'Edit Product' : 'Add Product'}
            </h1>
            <p
              className='text-xs text-[#888888] mt-0.5'
              style={{ fontFamily: 'Inter' }}>
              {isEdit
                ? `Editing: ${product!.name}`
                : 'Fill in the details below'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Link
            href='/dashboard/products'
            className='h-9 px-4 border border-[#DDDDDD] text-sm text-[#333333] hover:bg-[#F5F5F5] transition-colors flex items-center'
            style={{ fontFamily: 'Inter' }}>
            Cancel
          </Link>
          <button
            type='submit'
            disabled={mutation.isPending || isSubmitting}
            className='h-9 px-5 bg-black text-white text-sm font-medium hover:bg-[#111111] disabled:opacity-60 transition-colors flex items-center gap-2'
            style={{ fontFamily: 'Inter' }}>
            {mutation.isPending || isSubmitting ? (
              <>
                <svg
                  className='animate-spin'
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'>
                  <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                </svg>
                Saving…
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </div>

      {/* API error */}
      {apiError && (
        <div
          className='mx-8 mt-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm'
          style={{ fontFamily: 'Inter' }}>
          {apiError}
        </div>
      )}

      {/* Body */}
      <div className='flex gap-6 p-8 items-start overflow-y-auto'>
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className='flex-1 flex flex-col gap-6 min-w-0'>
          {/* Basic Information */}
          <Section title='Basic Information'>
            <Field label='Product Name' error={errors.name?.message} required>
              <input
                type='text'
                {...register('name')}
                placeholder='e.g. Modern Oak Sofa'
                className={inputCls(!!errors.name)}
              />
            </Field>
            <Field label='Description' error={errors.description?.message}>
              <textarea
                {...register('description')}
                placeholder='Describe the product — materials, comfort, use cases…'
                rows={5}
                className='w-full px-4 py-3 border border-[#DDDDDD] bg-white text-sm text-black placeholder:text-[#AAAAAA] focus:outline-none focus:border-black transition-colors resize-none'
                style={{ fontFamily: 'Inter' }}
              />
            </Field>
          </Section>

          {/* Physical Details */}
          <Section title='Physical Details'>
            <div className='grid grid-cols-2 gap-4'>
              <Field label='Material' error={errors.material?.message}>
                <input
                  type='text'
                  {...register('material')}
                  placeholder='e.g. Solid Oak'
                  className={inputCls(!!errors.material)}
                />
              </Field>
              <Field label='Color' error={errors.color?.message}>
                <input
                  type='text'
                  {...register('color')}
                  placeholder='e.g. Natural Brown'
                  className={inputCls(!!errors.color)}
                />
              </Field>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <Field label='Dimensions' error={errors.dimensions?.message}>
                <input
                  type='text'
                  {...register('dimensions')}
                  placeholder='e.g. 220cm x 90cm x 85cm'
                  className={inputCls(!!errors.dimensions)}
                />
              </Field>
              <Field label='Weight (kg)' error={errors.weight?.message}>
                <input
                  type='number'
                  min='0'
                  step='0.1'
                  {...register('weight')}
                  placeholder='e.g. 45.5'
                  className={inputCls(!!errors.weight)}
                />
              </Field>
            </div>
          </Section>

          {/* Media */}
          <Section title='Media'>
            {/* Thumbnail */}
            <Field
              label='Thumbnail'
              error={errors.thumbnail?.message as string | undefined}>
              {thumbnailPreview || existingThumbnail ? (
                <div className='flex flex-col gap-2'>
                  <div className='relative w-40 h-40 border border-[#DDDDDD] overflow-hidden'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailPreview ?? existingThumbnail!}
                      alt='Thumbnail preview'
                      className='w-full h-full object-cover'
                    />
                    {existingThumbnail && !thumbnailPreview && (
                      <span
                        className='absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5'
                        style={{ fontFamily: 'Inter' }}>
                        Current
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-3'>
                    <button
                      type='button'
                      onClick={removeThumbnail}
                      className='text-xs text-red-500 hover:text-red-700 transition-colors'
                      style={{ fontFamily: 'Inter' }}>
                      Remove thumbnail
                    </button>
                    <label
                      className='text-xs text-[#888888] hover:text-black cursor-pointer transition-colors underline underline-offset-2'
                      style={{ fontFamily: 'Inter' }}>
                      Replace
                      <Controller
                        control={control}
                        name='thumbnail'
                        render={() => (
                          <input
                            type='file'
                            accept='image/*'
                            className='sr-only'
                            onChange={(e) =>
                              handleThumbnailChange(e.target.files)
                            }
                          />
                        )}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed cursor-pointer transition-colors hover:bg-[#FAFAFA] ${
                    errors.thumbnail ? 'border-red-400' : 'border-[#DDDDDD]'
                  }`}>
                  <svg
                    width='28'
                    height='28'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    className='text-[#AAAAAA] mb-2'>
                    <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                    <circle cx='8.5' cy='8.5' r='1.5' />
                    <polyline points='21 15 16 10 5 21' />
                  </svg>
                  <span
                    className='text-xs text-[#AAAAAA]'
                    style={{ fontFamily: 'Inter' }}>
                    Click to upload thumbnail
                  </span>
                  <span
                    className='text-xs text-[#BBBBBB] mt-0.5'
                    style={{ fontFamily: 'Inter' }}>
                    PNG, JPG, WEBP — max 2 MB
                  </span>
                  <Controller
                    control={control}
                    name='thumbnail'
                    render={() => (
                      <input
                        type='file'
                        accept='image/*'
                        className='sr-only'
                        onChange={(e) => handleThumbnailChange(e.target.files)}
                      />
                    )}
                  />
                </label>
              )}
            </Field>

            {/* Product Images */}
            <Field
              label='Product Images'
              error={
                errors.images?.message ??
                (Array.isArray(errors.images)
                  ? (errors.images as Array<{ message?: string } | undefined>)
                      .map((e) => e?.message)
                      .filter(Boolean)
                      .join(', ')
                  : undefined)
              }>
              {existingImages.length > 0 || imagePreviews.length > 0 ? (
                <div className='flex flex-col gap-3'>
                  <div className='flex flex-wrap gap-3'>
                    {/* Existing server images */}
                    {existingImages.map((src, index) => (
                      <div key={src} className='relative group'>
                        <div className='w-24 h-24 border border-[#DDDDDD] overflow-hidden'>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Product image ${index + 1}`}
                            className='w-full h-full object-cover'
                          />
                          <span
                            className='absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity'
                            style={{ fontFamily: 'Inter' }}>
                            Saved
                          </span>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeExistingImage(index)}
                          className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none'>
                          ×
                        </button>
                      </div>
                    ))}

                    {/* New file previews */}
                    {imagePreviews.map((src, index) => (
                      <div key={src} className='relative group'>
                        <div className='w-24 h-24 border border-[#DDDDDD] overflow-hidden'>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`New image ${index + 1}`}
                            className='w-full h-full object-cover'
                          />
                          <span
                            className='absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity'
                            style={{ fontFamily: 'Inter' }}>
                            New
                          </span>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none'>
                          ×
                        </button>
                      </div>
                    ))}

                    {/* Add more images button */}
                    {existingImages.length + imagePreviews.length <
                      MAX_IMAGE_COUNT && (
                      <label className='w-24 h-24 border-2 border-dashed border-[#DDDDDD] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAFAFA] transition-colors'>
                        <svg
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          className='text-[#AAAAAA]'>
                          <line x1='12' y1='5' x2='12' y2='19' />
                          <line x1='5' y1='12' x2='19' y2='12' />
                        </svg>
                        <span
                          className='text-xs text-[#AAAAAA] mt-1'
                          style={{ fontFamily: 'Inter' }}>
                          Add more
                        </span>
                        <Controller
                          control={control}
                          name='images'
                          render={() => (
                            <input
                              type='file'
                              accept='image/*'
                              multiple
                              className='sr-only'
                              onChange={(e) =>
                                handleImagesChange(e.target.files)
                              }
                            />
                          )}
                        />
                      </label>
                    )}
                  </div>
                  <p
                    className='text-xs text-[#AAAAAA]'
                    style={{ fontFamily: 'Inter' }}>
                    {existingImages.length + imagePreviews.length} /{' '}
                    {MAX_IMAGE_COUNT} images
                    {imagePreviews.length > 0 && (
                      <span className='ml-1'>({imagePreviews.length} new)</span>
                    )}
                  </p>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed cursor-pointer transition-colors hover:bg-[#FAFAFA] ${
                    errors.images ? 'border-red-400' : 'border-[#DDDDDD]'
                  }`}>
                  <svg
                    width='28'
                    height='28'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    className='text-[#AAAAAA] mb-2'>
                    <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                    <circle cx='8.5' cy='8.5' r='1.5' />
                    <polyline points='21 15 16 10 5 21' />
                  </svg>
                  <span
                    className='text-xs text-[#AAAAAA]'
                    style={{ fontFamily: 'Inter' }}>
                    Click to upload product images
                  </span>
                  <span
                    className='text-xs text-[#BBBBBB] mt-0.5'
                    style={{ fontFamily: 'Inter' }}>
                    PNG, JPG, WEBP — max 5 MB each, up to 10 images
                  </span>
                  <Controller
                    control={control}
                    name='images'
                    render={() => (
                      <input
                        type='file'
                        accept='image/*'
                        multiple
                        className='sr-only'
                        onChange={(e) => handleImagesChange(e.target.files)}
                      />
                    )}
                  />
                </label>
              )}
            </Field>
          </Section>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className='w-72 flex-shrink-0 flex flex-col gap-6'>
          {/* Status */}
          <Section title='Status'>
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className='text-sm text-[#333333]'
                  style={{ fontFamily: 'Inter' }}>
                  Active
                </p>
                <p
                  className='text-xs text-[#AAAAAA] mt-0.5'
                  style={{ fontFamily: 'Inter' }}>
                  Visible to customers
                </p>
              </div>
              <Controller
                control={control}
                name='isActive'
                render={({ field }) => (
                  <button
                    type='button'
                    role='switch'
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      isActive ? 'bg-black' : 'bg-[#DDDDDD]'
                    }`}>
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                )}
              />
            </div>
          </Section>

          {/* Pricing */}
          <Section title='Pricing'>
            <Field label='Price (USD)' error={errors.price?.message} required>
              <div className='relative'>
                <span
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#AAAAAA]'
                  style={{ fontFamily: 'Inter' }}>
                  $
                </span>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  {...register('price')}
                  placeholder='0.00'
                  className={`${inputCls(!!errors.price)} pl-7`}
                />
              </div>
            </Field>
            <Field
              label='Discount Price (USD)'
              error={errors.discountPrice?.message}>
              <div className='relative'>
                <span
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#AAAAAA]'
                  style={{ fontFamily: 'Inter' }}>
                  $
                </span>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  {...register('discountPrice')}
                  placeholder='Optional'
                  className={`${inputCls(!!errors.discountPrice)} pl-7`}
                />
              </div>
            </Field>
          </Section>

          {/* Inventory */}
          <Section title='Inventory'>
            <Field label='SKU' error={errors.sku?.message} required>
              <input
                type='text'
                {...register('sku')}
                placeholder='e.g. FRN-SOF-001'
                className={inputCls(!!errors.sku)}
              />
            </Field>
            <Field
              label='Stock Quantity'
              error={errors.stock?.message}
              required>
              <input
                type='number'
                min='0'
                step='1'
                {...register('stock')}
                placeholder='0'
                className={inputCls(!!errors.stock)}
              />
            </Field>
          </Section>

          {/* Category */}
          <Section title='Category'>
            <Controller
              control={control}
              name='categoryIds'
              render={({ field }) => (
                <CategoryMultiSelect
                  categories={categories}
                  loading={categoriesLoading}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.categoryIds?.message as string | undefined}
                />
              )}
            />
          </Section>
        </div>
      </div>
    </form>
  );
}

// ── CategoryMultiSelect ───────────────────────────────────────────────────────

import type { Category } from '@/hooks/use-categories';

function CategoryMultiSelect({
  categories,
  loading,
  value,
  onChange,
  error,
}: {
  categories: Category[];
  loading: boolean;
  value: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open, handleOutsideClick]);

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  const selectedNames = categories
    .filter((c) => value.includes(c.id))
    .map((c) => c.name);

  return (
    <div ref={containerRef} className='flex flex-col gap-1.5'>
      <label
        className='text-xs font-medium text-[#333333]'
        style={{ fontFamily: 'Inter' }}>
        Categories
      </label>

      {/* Trigger */}
      <button
        type='button'
        disabled={loading}
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-10 px-4 border bg-white text-sm text-left flex items-center justify-between transition-colors focus:outline-none disabled:opacity-60 ${
          error
            ? 'border-red-400'
            : open
              ? 'border-black'
              : 'border-[#DDDDDD] hover:border-[#AAAAAA]'
        }`}
        style={{ fontFamily: 'Inter' }}>
        <span
          className={
            selectedNames.length === 0 ? 'text-[#AAAAAA]' : 'text-black'
          }>
          {loading
            ? 'Loading…'
            : selectedNames.length === 0
              ? 'Select categories…'
              : selectedNames.join(', ')}
        </span>
        <svg
          width='14'
          height='14'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={`text-[#888888] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d='m6 9 6 6 6-6' />
        </svg>
      </button>

      {/* Dropdown */}
      {open && categories.length > 0 && (
        <div
          className='border border-[#DDDDDD] bg-white shadow-sm max-h-48 overflow-y-auto'
          style={{ fontFamily: 'Inter' }}>
          {categories.map((cat) => {
            const checked = value.includes(cat.id);
            return (
              <label
                key={cat.id}
                className='flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#F5F5F5] transition-colors'>
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={() => toggle(cat.id)}
                  className='w-4 h-4 accent-black flex-shrink-0'
                />
                <span className='text-sm text-black truncate'>{cat.name}</span>
              </label>
            );
          })}
        </div>
      )}

      {open && categories.length === 0 && !loading && (
        <div
          className='border border-[#DDDDDD] bg-white px-4 py-3 text-sm text-[#AAAAAA]'
          style={{ fontFamily: 'Inter' }}>
          No categories available
        </div>
      )}

      {/* Selected chips */}
      {selectedNames.length > 0 && (
        <div className='flex flex-wrap gap-1.5 mt-0.5'>
          {categories
            .filter((c) => value.includes(c.id))
            .map((c) => (
              <span
                key={c.id}
                className='inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-xs rounded-sm'
                style={{ fontFamily: 'Inter' }}>
                {c.name}
                <button
                  type='button'
                  onClick={() => toggle(c.id)}
                  className='hover:opacity-70 transition-opacity leading-none'
                  aria-label={`Remove ${c.name}`}>
                  ×
                </button>
              </span>
            ))}
        </div>
      )}

      {error && (
        <p className='text-xs text-red-500' style={{ fontFamily: 'Inter' }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='bg-white border border-[#EEEEEE] p-6 flex flex-col gap-4'>
      <h2
        className='text-sm font-medium text-black border-b border-[#F0F0F0] pb-3 -mt-1'
        style={{ fontFamily: 'Inter' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label
        className='text-xs font-medium text-[#333333]'
        style={{ fontFamily: 'Inter' }}>
        {label}
        {required && <span className='text-red-500 ml-0.5'>*</span>}
      </label>
      {children}
      {error && (
        <p className='text-xs text-red-500' style={{ fontFamily: 'Inter' }}>
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full h-10 px-4 border bg-white text-sm text-black placeholder:text-[#AAAAAA] focus:outline-none focus:border-black transition-colors ${
    hasError ? 'border-red-400' : 'border-[#DDDDDD]'
  }`;
}
