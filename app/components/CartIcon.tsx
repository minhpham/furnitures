'use client';

import { useCart } from '@/lib/cart-context';

export default function CartIcon() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
      className="relative flex items-center justify-center w-10 h-10 text-[#666666] hover:text-black transition-colors"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-black text-white font-inter text-[10px] font-medium leading-none px-1">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
