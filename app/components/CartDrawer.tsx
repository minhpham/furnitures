'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useCart, type CartItem } from '@/lib/cart-context';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(value: number): string {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ── Cart Item Row ─────────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCart();
  const price = item.discountPrice ?? item.price;

  return (
    <div className="flex gap-4 py-5 border-b border-[#EEEEEE] last:border-b-0">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 bg-[#F5F5F5] flex-shrink-0 overflow-hidden">
        {item.thumbnail ? (
          <Image src={item.thumbnail} alt={item.name} fill sizes="80px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-instrument text-[15px] italic text-black leading-tight line-clamp-2">
            {item.name}
          </span>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
            className="flex-shrink-0 text-[#AAAAAA] hover:text-black transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity stepper */}
          <div className="flex items-center border border-[#DDDDDD]">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="w-7 h-7 flex items-center justify-center text-black hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-inter text-[13px]"
            >
              −
            </button>
            <span className="w-8 h-7 flex items-center justify-center font-inter text-[13px] text-black border-x border-[#DDDDDD]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
              className="w-7 h-7 flex items-center justify-center text-black hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-inter text-[13px]"
            >
              +
            </button>
          </div>

          {/* Line price */}
          <span className="font-inter text-[14px] font-medium text-black">
            {formatPrice(price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, clearCart, closeCart } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`
          fixed top-0 right-0 z-50 h-full w-[420px] max-w-[100vw]
          bg-white flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEEE]">
          <h2 className="font-instrument text-[22px] italic font-normal text-black">
            Your Cart
            {totalItems > 0 && (
              <span className="font-inter text-[13px] not-italic text-[#888888] ml-2">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-[#888888] hover:text-black transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="font-instrument text-[20px] italic text-black">Your cart is empty</p>
              <p className="font-inter text-[13px] text-[#888888]">Add a piece to get started.</p>
              <button
                type="button"
                onClick={closeCart}
                className="font-inter text-[12px] font-medium text-black tracking-[0.5px] uppercase border border-black px-6 py-2.5 hover:bg-black hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex flex-col gap-4 px-6 py-6 border-t border-[#EEEEEE]">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[13px] text-[#888888]">Subtotal</span>
              <span className="font-inter text-[18px] font-medium text-black">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="font-inter text-[11px] text-[#AAAAAA]">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              type="button"
              className="w-full h-13 bg-black text-white font-inter text-[13px] font-medium tracking-[0.5px] uppercase py-4 hover:bg-[#111111] active:bg-[#333333] transition-colors"
            >
              Checkout
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="font-inter text-[12px] text-[#AAAAAA] hover:text-black transition-colors text-center"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
