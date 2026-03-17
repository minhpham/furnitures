'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDeleteCategory, type Category } from '@/hooks/use-categories';

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Delete dialog ─────────────────────────────────────────────────────────────

function DeleteCategoryDialog({
  categoryId,
  categoryName,
  onClose,
}: {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
}) {
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  function handleConfirm() {
    deleteCategory(categoryId, { onSuccess: onClose });
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/40'
        onClick={onClose}
        aria-hidden='true'
      />
      <div className='relative bg-white w-full max-w-md p-8 shadow-xl'>
        <div className='w-12 h-12 bg-red-50 flex items-center justify-center mb-5'>
          <svg
            width='22'
            height='22'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#EF4444'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <polyline points='3 6 5 6 21 6' />
            <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' />
            <line x1='10' x2='10' y1='11' y2='17' />
            <line x1='14' x2='14' y1='11' y2='17' />
          </svg>
        </div>

        <h2
          className='text-xl font-medium text-black mb-2'
          style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic' }}>
          Delete Category
        </h2>
        <p
          className='text-sm text-[#666666] leading-relaxed'
          style={{ fontFamily: 'Inter' }}>
          Are you sure you want to delete{' '}
          <span className='font-medium text-black'>
            &ldquo;{categoryName}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>

        <div className='flex gap-3 mt-8'>
          <button
            type='button'
            onClick={onClose}
            disabled={isPending}
            className='flex-1 h-10 border border-[#DDDDDD] text-sm text-[#333333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50'
            style={{ fontFamily: 'Inter' }}>
            Cancel
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            disabled={isPending}
            className='flex-1 h-10 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2'
            style={{ fontFamily: 'Inter' }}>
            {isPending ? (
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
                Deleting…
              </>
            ) : (
              'Delete Category'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function CategoryListSkeleton() {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm' style={{ fontFamily: 'Inter' }}>
        <thead>
          <tr className='border-b border-[#EEEEEE]'>
            {['Name', 'Slug', 'Description', 'Status', 'Created', ''].map(
              (h, i) => (
                <th
                  key={i}
                  className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap'>
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className='divide-y divide-[#F5F5F5]'>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className='border-b border-[#F5F5F5]'>
              <td className='px-4 py-3'>
                <div className='h-4 w-32 bg-[#F0F0F0] rounded-sm animate-pulse' />
              </td>
              <td className='px-4 py-3'>
                <div className='h-4 w-28 bg-[#F0F0F0] rounded-sm animate-pulse' />
              </td>
              <td className='px-4 py-3'>
                <div className='h-4 w-48 bg-[#F0F0F0] rounded-sm animate-pulse' />
              </td>
              <td className='px-4 py-3'>
                <div className='h-5 w-14 bg-[#F0F0F0] rounded-sm animate-pulse' />
              </td>
              <td className='px-4 py-3'>
                <div className='h-4 w-24 bg-[#F0F0F0] rounded-sm animate-pulse' />
              </td>
              <td className='px-4 py-3'>
                <div className='flex gap-1'>
                  <div className='w-8 h-8 bg-[#F0F0F0] rounded-sm animate-pulse' />
                  <div className='w-8 h-8 bg-[#F0F0F0] rounded-sm animate-pulse' />
                </div>
              </td>
            </tr>
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
      <td colSpan={6} className='text-center py-20'>
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
              <rect x='2' y='7' width='20' height='14' rx='2' ry='2' />
              <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' />
            </svg>
          </div>
          <div className='flex flex-col gap-1'>
            <p
              className='text-sm font-medium text-[#333333]'
              style={{ fontFamily: 'Inter' }}>
              {hasSearch ? 'No categories found' : 'No categories yet'}
            </p>
            <p
              className='text-xs text-[#AAAAAA]'
              style={{ fontFamily: 'Inter' }}>
              {hasSearch
                ? 'Try a different search term.'
                : 'Add your first category to get started.'}
            </p>
          </div>
          {!hasSearch && (
            <Link
              href='/dashboard/categories/new'
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
              Add Category
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Data table ────────────────────────────────────────────────────────────────

function CategoryDataTable({
  categories,
  hasSearch,
  onDeleteRequest,
}: {
  categories: Category[];
  hasSearch: boolean;
  onDeleteRequest: (id: string, name: string) => void;
}) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm' style={{ fontFamily: 'Inter' }}>
        <thead>
          <tr className='border-b border-[#EEEEEE]'>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap'>
              Name
            </th>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap hidden md:table-cell'>
              Slug
            </th>
            <th className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap hidden lg:table-cell'>
              Description
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
          {categories.length === 0 ? (
            <EmptyState hasSearch={hasSearch} />
          ) : (
            categories.map((c) => (
              <tr key={c.id} className='hover:bg-[#FAFAFA] transition-colors'>
                {/* Name */}
                <td className='px-4 py-3'>
                  <p className='font-medium text-black truncate max-w-[200px]'>
                    {c.name}
                  </p>
                </td>

                {/* Slug */}
                <td className='px-4 py-3 hidden md:table-cell'>
                  <span className='text-xs text-[#888888] font-mono bg-[#F5F5F5] px-2 py-1 rounded-sm'>
                    {c.slug}
                  </span>
                </td>

                {/* Description */}
                <td className='px-4 py-3 hidden lg:table-cell'>
                  <p className='text-sm text-[#666666] truncate max-w-[260px]'>
                    {c.description ?? <span className='text-[#BBBBBB]'>—</span>}
                  </p>
                </td>

                {/* Status */}
                <td className='px-4 py-3'>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-sm ${
                      c.isActive
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-[#F5F5F5] text-[#888888] border border-[#DDDDDD]'
                    }`}
                    style={{ fontFamily: 'Inter' }}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Created at */}
                <td className='px-4 py-3 whitespace-nowrap text-sm text-[#666666] hidden lg:table-cell'>
                  {formatDate(c.createdAt)}
                </td>

                {/* Actions */}
                <td className='px-4 py-3'>
                  <div className='flex items-center justify-end gap-1'>
                    <Link
                      href={`/dashboard/categories/${c.id}`}
                      className='w-8 h-8 flex items-center justify-center text-[#888888] hover:text-black hover:bg-[#F0F0F0] transition-colors rounded-sm'
                      aria-label={`Edit ${c.name}`}>
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
                      onClick={() => onDeleteRequest(c.id, c.name)}
                      className='w-8 h-8 flex items-center justify-center text-[#888888] hover:text-red-600 hover:bg-red-50 transition-colors rounded-sm'
                      aria-label={`Delete ${c.name}`}>
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
  initialData: Category[];
}

export function CategoryListClient({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [categories, setCategories] = useState<Category[]>(initialData);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    setCategories(initialData);
  }, [initialData]);

  // ── Search (client-side filter) ───────────────────────────────────────────

  const currentSearch = searchParams.get('search') ?? '';
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchInput(searchParams.get('search') ?? '');
  }, [searchParams]);

  const pushSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(`/dashboard/categories${qs ? `?${qs}` : ''}`);
      });
    },
    [router, searchParams],
  );

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushSearch(value);
    }, 300);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filtered = currentSearch
    ? categories.filter((c) => {
        const q = currentSearch.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description ?? '').toLowerCase().includes(q)
        );
      })
    : categories;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Header bar */}
      <div className='flex items-center justify-between px-8 py-5 bg-white border-b border-[#EEEEEE]'>
        <div>
          <h1
            className='text-2xl text-black'
            style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic' }}>
            Categories
          </h1>
          <p
            className='text-xs text-[#888888] mt-0.5'
            style={{ fontFamily: 'Inter' }}>
            Manage your product categories
          </p>
        </div>

        <Link
          href='/dashboard/categories/new'
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
          Add Category
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
            placeholder='Search categories…'
            className='w-full h-9 pl-9 pr-4 border border-[#DDDDDD] bg-white text-sm text-black placeholder:text-[#AAAAAA] focus:outline-none focus:border-black transition-colors'
            style={{ fontFamily: 'Inter' }}
          />
        </div>
      </div>

      {/* Table area */}
      <div className='flex-1 bg-white'>
        <CategoryDataTable
          categories={filtered}
          hasSearch={currentSearch !== ''}
          onDeleteRequest={(id, name) => setDeleteTarget({ id, name })}
        />
      </div>

      {/* Count footer */}
      <div
        className='px-4 py-3 border-t border-[#EEEEEE] bg-white'
        style={{ fontFamily: 'Inter' }}>
        <p className='text-xs text-[#888888]'>
          {filtered.length === 0
            ? 'No categories'
            : `Showing ${filtered.length} categor${filtered.length !== 1 ? 'ies' : 'y'}`}
        </p>
      </div>

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <DeleteCategoryDialog
          categoryId={deleteTarget.id}
          categoryName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
