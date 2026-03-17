'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/hooks/use-products';
import { useCart } from '@/lib/cart-context';

function formatPrice(value: string | number): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(n)) return '—';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function ProductCardClient({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount =
    product.discountPrice != null &&
    Number(product.discountPrice) !== Number(product.price);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        discountPrice: product.discountPrice != null ? Number(product.discountPrice) : null,
        thumbnail: product.thumbnail ?? null,
        stock: product.stock ?? 1,
      },
      1,
    );
    openCart();
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex flex-col flex-1 bg-white group"
      aria-label={`View ${product.name}`}
    >
      {/* Image + hover Add to Cart */}
      <div className="relative w-full h-[320px] bg-[#F5F5F5] overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 1440px) 33vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}

        {/* Add to Cart overlay button */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.isActive || (product.stock ?? 0) === 0}
            className="w-full py-3.5 bg-black text-white font-inter text-[12px] font-medium tracking-[0.5px] uppercase hover:bg-[#222222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {(product.stock ?? 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 pt-5 pb-2">
        {product.category && (
          <span
            className="text-[11px] text-[#888888] uppercase"
            style={{ fontFamily: 'Inter', letterSpacing: '1.5px' }}
          >
            {product.category.name}
          </span>
        )}
        <h3
          className="text-[20px] italic text-black font-normal group-hover:underline transition-colors"
          style={{ fontFamily: 'Instrument Serif' }}
        >
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-[16px] font-medium text-black" style={{ fontFamily: 'Inter' }}>
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-[14px] text-[#AAAAAA] line-through" style={{ fontFamily: 'Inter' }}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
