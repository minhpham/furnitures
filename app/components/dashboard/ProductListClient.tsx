'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductListResponse, Product } from '@/hooks/use-products';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(value: string | number): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '—';
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ThumbnailCell({ src, name }: { src: string | null; name: string }) {
  if (src) {
    return (
      <div className='w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 border border-[#EEEEEE] relative'>
        <img src={src} alt={''} className='object-cover w-full h-full' />
      </div>
    );
  }
  return (
    <div className='w-12 h-12 rounded-sm flex-shrink-0 border border-[#EEEEEE] bg-[#F5F5F5] flex items-center justify-center'>
      <svg
        width='22'
        height='22'
        viewBox='0 0 24 24'
        fill='none'
        stroke='#BBBBBB'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'>
        <path d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' />
        <path d='m3.3 7 8.7 5 8.7-5' />
        <path d='M12 22V12' />
      </svg>
    </div>
  );
}

function PriceCell({
  price,
  discountPrice,
}: {
  price: string | number;
  discountPrice: string | number | null;
}) {
  if (discountPrice != null) {
    return (
      <div className='flex flex-col gap-0.5'>
        <span className='font-medium text-black text-sm'>
          {formatPrice(discountPrice)}
        </span>
        <span className='text-xs text-[#AAAAAA] line-through'>
          {formatPrice(price)}
        </span>
      </div>
    );
  }
  return (
    <span className='font-medium text-black text-sm'>{formatPrice(price)}</span>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const qty = stock ?? 0;
  let cls = '';
  if (qty === 0) {
    cls = 'bg-red-50 text-red-700 border border-red-200';
  } else if (qty <= 10) {
    cls = 'bg-yellow-50 text-yellow-700 border border-yellow-200';
  } else {
    cls = 'bg-green-50 text-green-700 border border-green-200';
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-sm ${cls}`}
      style={{ fontFamily: 'Inter' }}>
      {qty}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-sm ${
        isActive
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-[#F5F5F5] text-[#888888] border border-[#DDDDDD]'
      }`}
      style={{ fontFamily: 'Inter' }}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function CategoryBadge({ category }: { category: Product['categories'] }) {
  if (!category || category.length === 0) {
    return <span className='text-[#BBBBBB] text-sm'>—</span>;
  }
  return (
    <span
      className='inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-sm bg-slate-100 text-slate-600 border border-slate-200'
      style={{ fontFamily: 'Inter' }}>
      {category.map((c) => c.name).join(', ')}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className='border-b border-[#F5F5F5]'>
      <td className='px-4 py-3'>
        <div className='w-12 h-12 bg-[#F0F0F0] rounded-sm animate-pulse' />
      </td>
      <td className='px-4 py-3'>
        <div className='flex flex-col gap-1.5'>
          <div className='h-4 w-32 bg-[#F0F0F0] rounded-sm animate-pulse' />
          <div className='h-3 w-16 bg-[#F0F0F0] rounded-sm animate-pulse' />
        </div>
      </td>
      <td className='px-4 py-3 hidden md:table-cell'>
        <div className='h-4 w-20 bg-[#F0F0F0] rounded-sm animate-pulse' />
      </td>
      <td className='px-4 py-3'>
        <div className='h-4 w-16 bg-[#F0F0F0] rounded-sm animate-pulse' />
      </td>
      <td className='px-4 py-3'>
        <div className='h-5 w-8 bg-[#F0F0F0] rounded-sm animate-pulse' />
      </td>
      <td className='px-4 py-3'>
        <div className='h-5 w-14 bg-[#F0F0F0] rounded-sm animate-pulse' />
      </td>
      <td className='px-4 py-3 hidden lg:table-cell'>
        <div className='h-4 w-24 bg-[#F0F0F0] rounded-sm animate-pulse' />
      </td>
      <td className='px-4 py-3'>
        <div className='flex gap-1'>
          <div className='w-8 h-8 bg-[#F0F0F0] rounded-sm animate-pulse' />
          <div className='w-8 h-8 bg-[#F0F0F0] rounded-sm animate-pulse' />
        </div>
      </td>
    </tr>
  );
}

export function ProductListSkeleton() {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm' style={{ fontFamily: 'Inter' }}>
        <thead>
          <tr className='border-b border-[#EEEEEE]'>
            {[
              '',
              'Product',
              'Category',
              'Price',
              'Stock',
              'Status',
              'Created',
              '',
            ].map((h, i) => (
              <th
                key={i}
                className={`text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap ${
                  h === 'Category' ? 'hidden md:table-cell' : ''
                } ${h === 'Created' ? 'hidden lg:table-cell' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-[#F5F5F5]'>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <tr>
      <td colSpan={8} className='text-center py-20'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-14 h-14 bg-[#F5F5F5] rounded-sm flex items-center justify-center'>
            <svg
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#CCCCCC'
              strokeWidth='1.25'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' />
              <path d='m3.3 7 8.7 5 8.7-5' />
              <path d='M12 22V12' />
            </svg>
          </div>
          <div className='flex flex-col gap-1'>
            <p
              className='text-sm font-medium text-[#333333]'
              style={{ fontFamily: 'Inter' }}>
              {hasSearch ? 'No products found' : 'No products yet'}
            </p>
            <p
              className='text-xs text-[#AAAAAA]'
              style={{ fontFamily: 'Inter' }}>
              {hasSearch
                ? 'Try a different search term.'
                : 'Add your first product to get started.'}
            </p>
          </div>
          {!hasSearch && (
            <Link
              href='/dashboard/products/new'
              className='mt-1 h-9 px-5 bg-black text-white text-sm font-medium hover:bg-[#111111] transition-colors flex items-center gap-2'
              style={{ fontFamily: 'Inter' }}>
              <svg
                width='13'
                height='13'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <line x1='12' x2='12' y1='5' y2='19' />
                <line x1='5' x2='19' y1='12' y2='12' />
              </svg>
              Add Product
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page number list: always show first, last, current ±1, and ellipses
  function buildPageNumbers(): Array<number | '…'> {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: Array<number | '…'> = [];
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);

    pages.push(1);
    if (left > 2) pages.push('…');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('…');
    pages.push(totalPages);
    return pages;
  }

  const pageNumbers = buildPageNumbers();

  const btnBase =
    'h-8 min-w-[2rem] px-2 flex items-center justify-center text-xs border transition-colors rounded-sm';
  const btnActive = 'bg-black text-white border-black';
  const btnInactive =
    'bg-white text-[#333333] border-[#DDDDDD] hover:bg-[#F5F5F5]';
  const btnDisabled =
    'bg-white text-[#CCCCCC] border-[#EEEEEE] cursor-not-allowed';

  return (
    <div
      className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-[#EEEEEE]'
      style={{ fontFamily: 'Inter' }}>
      <p className='text-xs text-[#888888]'>
        {total === 0
          ? 'No products'
          : `Showing ${from}–${to} of ${total} product${total !== 1 ? 's' : ''}`}
      </p>

      {totalPages > 1 && (
        <div className='flex items-center gap-1'>
          {/* Prev */}
          <button
            type='button'
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={`${btnBase} ${page <= 1 ? btnDisabled : btnInactive}`}
            aria-label='Previous page'>
            <svg
              width='13'
              height='13'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='m15 18-6-6 6-6' />
            </svg>
          </button>

          {pageNumbers.map((p, i) =>
            p === '…' ? (
              <span
                key={`ellipsis-${i}`}
                className='h-8 min-w-[2rem] px-2 flex items-center justify-center text-xs text-[#BBBBBB]'>
                …
              </span>
            ) : (
              <button
                key={p}
                type='button'
                onClick={() => onPageChange(p as number)}
                className={`${btnBase} ${p === page ? btnActive : btnInactive}`}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}>
                {p}
              </button>
            ),
          )}

          {/* Next */}
          <button
            type='button'
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className={`${btnBase} ${page >= totalPages ? btnDisabled : btnInactive}`}
            aria-label='Next page'>
            <svg
              width='13'
              height='13'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='m9 18 6-6-6-6' />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Data table ────────────────────────────────────────────────────────────────

interface TableProps {
  products: Product[];
  hasSearch: boolean;
  onDeleteRequest: (id: string, name: string) => void;
}

function ProductDataTable({
  products,
  hasSearch,
  onDeleteRequest,
}: TableProps) {
  const hasProducts = products.length > 0;

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm' style={{ fontFamily: 'Inter' }}>
        <thead>
          <tr className='border-b border-[#EEEEEE]'>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 w-16'>
              {/* thumbnail */}
            </th>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap'>
              Product
            </th>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap hidden md:table-cell'>
              Category
            </th>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap'>
              Price
            </th>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap'>
              Stock
            </th>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap'>
              Status
            </th>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap hidden lg:table-cell'>
              Created
            </th>
            <th className='px-4 py-3 w-20' />
          </tr>
        </thead>
        <tbody className='divide-y divide-[#F5F5F5]'>
          {!hasProducts ? (
            <EmptyState hasSearch={hasSearch} />
          ) : (
            products.map((p) => (
              <tr key={p.id} className='hover:bg-[#FAFAFA] transition-colors'>
                {/* Thumbnail */}
                <td className='px-4 py-3'>
                  <ThumbnailCell src={p.thumbnail} name={p.name} />
                </td>

                {/* Name + SKU */}
                <td className='px-4 py-3'>
                  <div className='min-w-0'>
                    <p className='font-medium text-black truncate max-w-[180px]'>
                      {p.name}
                    </p>
                    <p className='text-xs text-[#AAAAAA] font-mono mt-0.5'>
                      {p.sku || '—'}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td className='px-4 py-3 hidden md:table-cell'>
                  <CategoryBadge category={p.categories} />
                </td>

                {/* Price */}
                <td className='px-4 py-3 whitespace-nowrap'>
                  <PriceCell price={p.price} discountPrice={p.discountPrice} />
                </td>

                {/* Stock */}
                <td className='px-4 py-3 whitespace-nowrap'>
                  <StockBadge stock={p.stock} />
                </td>

                {/* Status */}
                <td className='px-4 py-3'>
                  <StatusBadge isActive={p.isActive} />
                </td>

                {/* Created At */}
                <td className='px-4 py-3 whitespace-nowrap text-sm text-[#666666] hidden lg:table-cell'>
                  {formatDate(p.createdAt)}
                </td>

                {/* Actions */}
                <td className='px-4 py-3'>
                  <div className='flex items-center justify-end gap-1'>
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className='w-8 h-8 flex items-center justify-center text-[#888888] hover:text-black hover:bg-[#F0F0F0] transition-colors rounded-sm'
                      aria-label={`Edit ${p.name}`}>
                      <svg
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'>
                        <path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
                      </svg>
                    </Link>
                    <button
                      type='button'
                      onClick={() => onDeleteRequest(p.id, p.name)}
                      className='w-8 h-8 flex items-center justify-center text-[#888888] hover:text-red-600 hover:bg-red-50 transition-colors rounded-sm'
                      aria-label={`Delete ${p.name}`}>
                      <svg
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'>
                        <polyline points='3 6 5 6 21 6' />
                        <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

interface Props {
  initialData: ProductListResponse;
}

export function ProductListClient({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state mirrors the server-rendered data and updates on navigation
  const [data, setData] = useState<ProductListResponse>(initialData);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Keep local data in sync whenever the server re-renders with new props
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // ── Derived values ────────────────────────────────────────────────────────

  const currentPage = data.page;
  const currentSearch = searchParams.get('search') ?? '';

  // ── URL navigation helpers ────────────────────────────────────────────────

  const pushParams = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(overrides)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(`/dashboard/products${qs ? `?${qs}` : ''}`);
      });
    },
    [router, searchParams],
  );

  // ── Debounced search ──────────────────────────────────────────────────────

  const [searchInput, setSearchInput] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep input in sync with URL (e.g. back-button navigation)
  useEffect(() => {
    setSearchInput(searchParams.get('search') ?? '');
  }, [searchParams]);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Reset to page 1 on new search
      pushParams({ search: value || null, page: null });
    }, 300);
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Pagination ────────────────────────────────────────────────────────────

  function handlePageChange(page: number) {
    pushParams({ page: String(page) });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Header bar */}
      <div className='flex items-center justify-between px-8 py-5 bg-white border-b border-[#EEEEEE]'>
        <div>
          <h1
            className='text-2xl text-black'
            style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic' }}>
            Products
          </h1>
          <p
            className='text-xs text-[#888888] mt-0.5'
            style={{ fontFamily: 'Inter' }}>
            Manage your product catalogue
          </p>
        </div>

        <Link
          href='/dashboard/products/new'
          className='h-9 px-5 bg-black text-white text-sm font-medium hover:bg-[#111111] transition-colors flex items-center gap-2'
          style={{ fontFamily: 'Inter' }}>
          <svg
            width='13'
            height='13'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <line x1='12' x2='12' y1='5' y2='19' />
            <line x1='5' x2='19' y1='12' y2='12' />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Search bar */}
      <div className='px-8 py-4 bg-white border-b border-[#EEEEEE]'>
        <div className='relative max-w-sm'>
          <svg
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#AAAAAA'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.3-4.3' />
          </svg>
          <input
            type='search'
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder='Search products…'
            className='w-full h-9 pl-9 pr-4 border border-[#DDDDDD] bg-white text-sm text-black placeholder:text-[#AAAAAA] focus:outline-none focus:border-black transition-colors'
            style={{ fontFamily: 'Inter' }}
          />
        </div>
      </div>

      {/* Table area */}
      <div className='flex-1 bg-white'>
        {isPending ? (
          <ProductListSkeleton />
        ) : (
          <ProductDataTable
            products={data.items}
            hasSearch={currentSearch !== ''}
            onDeleteRequest={(id, name) => setDeleteTarget({ id, name })}
          />
        )}
      </div>

      {/* Pagination */}
      {!isPending && (
        <Pagination
          page={currentPage}
          totalPages={data.totalPages}
          total={data.total}
          limit={data.limit}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          productId={deleteTarget.id}
          productName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => router.refresh()}
        />
      )}
    </>
  );
}
