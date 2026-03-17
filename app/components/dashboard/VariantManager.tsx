'use client';

import { useState } from 'react';
import {
  useProductVariants,
  useCreateVariant,
  useDeleteVariant,
  type ProductVariant,
} from '@/hooks/use-products';
import { ApiError } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AddForm {
  label: string;
  value: string;
  priceModifier: string;
  stock: string;
  sku: string;
}

const EMPTY_FORM: AddForm = {
  label: '',
  value: '',
  priceModifier: '',
  stock: '',
  sku: '',
};

const COMMON_LABELS = ['Color', 'Size', 'Material', 'Finish', 'Style'];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Group flat variant list by label */
function groupByLabel(
  variants: ProductVariant[],
): Array<{ label: string; options: ProductVariant[] }> {
  const map = new Map<string, ProductVariant[]>();
  for (const v of variants) {
    if (!map.has(v.label)) map.set(v.label, []);
    map.get(v.label)!.push(v);
  }
  return Array.from(map.entries()).map(([label, options]) => ({ label, options }));
}

function formatModifier(n: number | null): string {
  if (n == null || n === 0) return '—';
  return n > 0 ? `+$${n}` : `-$${Math.abs(n)}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function inputCls(hasError = false) {
  return `w-full h-9 px-3 border bg-white text-sm text-black placeholder:text-[#AAAAAA] focus:outline-none focus:border-black transition-colors ${
    hasError ? 'border-red-400' : 'border-[#DDDDDD]'
  }`;
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  productId: string;
}

export function VariantManager({ productId }: Props) {
  const { data: variants = [], isLoading } = useProductVariants(productId);
  const createMutation = useCreateVariant(productId);
  const deleteMutation = useDeleteVariant(productId);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddForm, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const groups = groupByLabel(variants);

  const apiError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error
        ? 'Failed to add variant.'
        : null;

  // ── Form handlers ───────────────────────────────────────────────────────────

  function validate(): boolean {
    const errors: Partial<Record<keyof AddForm, string>> = {};
    if (!form.label.trim()) errors.label = 'Label is required';
    if (!form.value.trim()) errors.value = 'Value is required';
    if (form.priceModifier && isNaN(Number(form.priceModifier)))
      errors.priceModifier = 'Must be a number';
    if (form.stock && (isNaN(Number(form.stock)) || Number(form.stock) < 0))
      errors.stock = 'Must be a non-negative number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAdd() {
    if (!validate()) return;
    createMutation.mutate(
      {
        label: form.label.trim(),
        value: form.value.trim(),
        priceModifier: form.priceModifier ? Number(form.priceModifier) : null,
        stock: form.stock ? Number(form.stock) : null,
        sku: form.sku.trim() || null,
      },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM);
          setFormErrors({});
          setShowForm(false);
        },
      },
    );
  }

  function handleDelete(variantId: string) {
    deleteMutation.mutate(variantId, {
      onSuccess: () => setDeleteConfirm(null),
    });
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowForm(false);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className='bg-white border border-[#EEEEEE] p-6 flex flex-col gap-4'>
      {/* Section header */}
      <div className='flex items-center justify-between border-b border-[#F0F0F0] pb-3 -mt-1'>
        <h2 className='text-sm font-medium text-black' style={{ fontFamily: 'Inter' }}>
          Variants
          {variants.length > 0 && (
            <span className='ml-2 text-xs text-[#888888] font-normal'>
              ({variants.length} option{variants.length !== 1 ? 's' : ''})
            </span>
          )}
        </h2>
        {!showForm && (
          <button
            type='button'
            onClick={() => setShowForm(true)}
            className='flex items-center gap-1.5 text-xs text-[#333333] border border-[#DDDDDD] px-3 h-7 hover:bg-[#F5F5F5] transition-colors'
            style={{ fontFamily: 'Inter' }}>
            <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
              <line x1='12' y1='5' x2='12' y2='19' />
              <line x1='5' y1='12' x2='19' y2='12' />
            </svg>
            Add Option
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className='flex flex-col gap-2'>
          {[1, 2].map((i) => (
            <div key={i} className='h-8 bg-[#F0F0F0] animate-pulse rounded-sm' />
          ))}
        </div>
      )}

      {/* Variant groups */}
      {!isLoading && groups.length > 0 && (
        <div className='flex flex-col gap-4'>
          {groups.map(({ label, options }) => (
            <div key={label}>
              <p className='text-xs font-medium text-[#888888] uppercase tracking-wider mb-2' style={{ fontFamily: 'Inter' }}>
                {label}
              </p>
              <div className='flex flex-col divide-y divide-[#F5F5F5] border border-[#EEEEEE]'>
                {options.map((v) => (
                  <div key={v.id} className='flex items-center justify-between px-3 py-2 group hover:bg-[#FAFAFA] transition-colors'>
                    <div className='flex items-center gap-3 min-w-0'>
                      {/* Color swatch if label is "Color" */}
                      {label.toLowerCase() === 'color' && (
                        <span
                          className='w-5 h-5 rounded-full border border-[#DDDDDD] shrink-0'
                          style={{ backgroundColor: v.value }}
                        />
                      )}
                      <span className='text-sm text-black' style={{ fontFamily: 'Inter' }}>
                        {v.value}
                      </span>
                      {v.priceModifier != null && v.priceModifier !== 0 && (
                        <span className='text-xs text-[#888888]' style={{ fontFamily: 'Inter' }}>
                          {formatModifier(v.priceModifier)}
                        </span>
                      )}
                      {v.stock != null && (
                        <span className='text-xs text-[#AAAAAA]' style={{ fontFamily: 'Inter' }}>
                          stock: {v.stock}
                        </span>
                      )}
                      {v.sku && (
                        <span className='text-xs font-mono text-[#AAAAAA]'>{v.sku}</span>
                      )}
                    </div>

                    {/* Delete */}
                    {deleteConfirm === v.id ? (
                      <div className='flex items-center gap-2 shrink-0'>
                        <span className='text-xs text-[#666666]' style={{ fontFamily: 'Inter' }}>
                          Remove?
                        </span>
                        <button
                          type='button'
                          onClick={() => handleDelete(v.id)}
                          disabled={deleteMutation.isPending}
                          className='text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50 transition-colors'
                          style={{ fontFamily: 'Inter' }}>
                          {deleteMutation.isPending ? '…' : 'Yes'}
                        </button>
                        <button
                          type='button'
                          onClick={() => setDeleteConfirm(null)}
                          className='text-xs text-[#888888] hover:text-black transition-colors'
                          style={{ fontFamily: 'Inter' }}>
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type='button'
                        onClick={() => setDeleteConfirm(v.id)}
                        className='opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center text-[#AAAAAA] hover:text-red-600 hover:bg-red-50 rounded-sm'
                        aria-label={`Remove ${v.value}`}>
                        <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                          <line x1='18' y1='6' x2='6' y2='18' />
                          <line x1='6' y1='6' x2='18' y2='18' />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state (no variants, no form open) */}
      {!isLoading && variants.length === 0 && !showForm && (
        <p className='text-sm text-[#AAAAAA] text-center py-4' style={{ fontFamily: 'Inter' }}>
          No variants yet. Add options like Color or Size.
        </p>
      )}

      {/* Add variant form */}
      {showForm && (
        <div className='flex flex-col gap-3 p-4 border border-[#DDDDDD] bg-[#FAFAFA]'>
          <p className='text-xs font-medium text-[#333333]' style={{ fontFamily: 'Inter' }}>
            New Variant Option
          </p>

          <div className='grid grid-cols-2 gap-3'>
            {/* Label */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-[#333333]' style={{ fontFamily: 'Inter' }}>
                Label <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                list='variant-labels'
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder='e.g. Color, Size'
                className={inputCls(!!formErrors.label)}
              />
              <datalist id='variant-labels'>
                {COMMON_LABELS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
              {formErrors.label && (
                <p className='text-xs text-red-500' style={{ fontFamily: 'Inter' }}>{formErrors.label}</p>
              )}
            </div>

            {/* Value */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-[#333333]' style={{ fontFamily: 'Inter' }}>
                Value <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                placeholder='e.g. Natural Oak, Large'
                className={inputCls(!!formErrors.value)}
              />
              {formErrors.value && (
                <p className='text-xs text-red-500' style={{ fontFamily: 'Inter' }}>{formErrors.value}</p>
              )}
            </div>

            {/* Price Modifier */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-[#333333]' style={{ fontFamily: 'Inter' }}>
                Price Modifier
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#AAAAAA]' style={{ fontFamily: 'Inter' }}>
                  $
                </span>
                <input
                  type='number'
                  step='0.01'
                  value={form.priceModifier}
                  onChange={(e) => setForm((f) => ({ ...f, priceModifier: e.target.value }))}
                  placeholder='0 (optional)'
                  className={`${inputCls(!!formErrors.priceModifier)} pl-6`}
                />
              </div>
              {formErrors.priceModifier && (
                <p className='text-xs text-red-500' style={{ fontFamily: 'Inter' }}>{formErrors.priceModifier}</p>
              )}
            </div>

            {/* Stock */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-[#333333]' style={{ fontFamily: 'Inter' }}>
                Stock
              </label>
              <input
                type='number'
                min='0'
                step='1'
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder='Optional'
                className={inputCls(!!formErrors.stock)}
              />
              {formErrors.stock && (
                <p className='text-xs text-red-500' style={{ fontFamily: 'Inter' }}>{formErrors.stock}</p>
              )}
            </div>
          </div>

          {/* SKU */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-[#333333]' style={{ fontFamily: 'Inter' }}>
              Variant SKU
            </label>
            <input
              type='text'
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              placeholder='Optional — leave blank to use product SKU'
              className={inputCls()}
            />
          </div>

          {apiError && (
            <p className='text-xs text-red-500 px-3 py-2 bg-red-50 border border-red-200' style={{ fontFamily: 'Inter' }}>
              {apiError}
            </p>
          )}

          <div className='flex gap-2 justify-end'>
            <button
              type='button'
              onClick={handleCancel}
              className='h-8 px-4 text-xs text-[#333333] border border-[#DDDDDD] hover:bg-[#F5F5F5] transition-colors'
              style={{ fontFamily: 'Inter' }}>
              Cancel
            </button>
            <button
              type='button'
              onClick={handleAdd}
              disabled={createMutation.isPending}
              className='h-8 px-4 text-xs text-white bg-black hover:bg-[#111111] disabled:opacity-60 transition-colors flex items-center gap-1.5'
              style={{ fontFamily: 'Inter' }}>
              {createMutation.isPending ? (
                <>
                  <svg className='animate-spin' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                  </svg>
                  Adding…
                </>
              ) : (
                'Add Option'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
