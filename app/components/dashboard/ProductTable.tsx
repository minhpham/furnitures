'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/hooks/use-products';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface Props {
  products: Product[];
}

function ActiveBadge({ isActive }: { isActive: boolean }) {
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

function PriceCell({ price, discountPrice }: { price: string | number; discountPrice: string | number | null }) {
  const fmt = (n: string | number) =>
    `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  if (discountPrice != null) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-black">{fmt(discountPrice)}</span>
        <span className="text-xs text-[#AAAAAA] line-through">{fmt(price)}</span>
      </div>
    );
  }
  return <span className="font-medium text-black">{fmt(price)}</span>;
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className='text-center py-20'>
        <div className='flex flex-col items-center gap-3'>
          <svg
            width='40'
            height='40'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#CCCCCC'
            strokeWidth='1.25'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' />
          </svg>
          <p className='text-sm text-[#AAAAAA]' style={{ fontFamily: 'Inter' }}>
            No products yet. Add your first one.
          </p>
        </div>
      </td>
    </tr>
  );
}

export function ProductTable({ products }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const rows = Array.isArray(products) ? products : [];

  return (
    <>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm' style={{ fontFamily: 'Inter' }}>
          <thead>
            <tr className='border-b border-[#EEEEEE]'>
              {['Product', 'SKU', 'Price', 'Stock', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className='text-left text-xs font-medium text-[#888888] px-4 py-3 whitespace-nowrap'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-[#F5F5F5]'>
            {rows.length === 0 ? (
              <EmptyState />
            ) : (
              rows.map((p) => (
                <tr key={p.id} className='hover:bg-[#FAFAFA] transition-colors'>
                  {/* Product name + description */}
                  <td className='px-4 py-3'>
                    <div className='min-w-0'>
                      <p className='font-medium text-black truncate max-w-[200px]'>{p.name}</p>
                      {p.description && (
                        <p className='text-xs text-[#AAAAAA] truncate max-w-[200px] mt-0.5'>
                          {p.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* SKU */}
                  <td className='px-4 py-3 text-[#666666] whitespace-nowrap font-mono text-xs'>
                    {p.sku || '—'}
                  </td>

                  {/* Price / Discount Price */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {p.price != null ? (
                      <PriceCell price={p.price} discountPrice={p.discountPrice} />
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Stock */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <span
                      className={`font-medium ${
                        (p.stock ?? 0) === 0 ? 'text-red-500' : 'text-black'
                      }`}>
                      {p.stock ?? 0}
                    </span>
                  </td>

                  {/* Active */}
                  <td className='px-4 py-3'>
                    <ActiveBadge isActive={p.isActive} />
                  </td>

                  {/* Actions */}
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-1'>
                      <Link
                        href={`/dashboard/products/${p.id}`}
                        className='w-8 h-8 flex items-center justify-center text-[#888888] hover:text-black hover:bg-[#F0F0F0] transition-colors rounded-sm'
                        aria-label='Edit product'>
                        <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                          <path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
                        </svg>
                      </Link>
                      <button
                        type='button'
                        onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                        className='w-8 h-8 flex items-center justify-center text-[#888888] hover:text-red-600 hover:bg-red-50 transition-colors rounded-sm'
                        aria-label='Delete product'>
                        <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
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

      {deleteTarget && (
        <DeleteConfirmDialog
          productId={deleteTarget.id}
          productName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
