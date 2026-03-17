"use client";

import { useDeleteProduct } from "@/hooks/use-products";
import { ApiError } from "@/lib/api";

interface Props {
  productId: string;
  productName: string;
  onClose: () => void;
  onDeleted?: () => void;
}

export function DeleteConfirmDialog({ productId, productName, onClose, onDeleted }: Props) {
  const { mutate: deleteProduct, isPending, error } = useDeleteProduct();

  const errorMessage = error instanceof ApiError
    ? error.message
    : error
    ? "Failed to delete product. Please try again."
    : null;

  function handleConfirm() {
    deleteProduct(productId, {
      onSuccess: () => {
        onClose();
        onDeleted?.();
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={!isPending ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-white w-full max-w-md p-8 shadow-xl">
        {/* Icon */}
        <div className="w-12 h-12 bg-red-50 flex items-center justify-center mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </div>

        <h2
          className="text-xl font-medium text-black mb-2"
          style={{ fontFamily: "Instrument Serif", fontStyle: "italic" }}
        >
          Delete Product
        </h2>
        <p className="text-sm text-[#666666] leading-relaxed" style={{ fontFamily: "Inter" }}>
          Are you sure you want to delete{" "}
          <span className="font-medium text-black">&ldquo;{productName}&rdquo;</span>? This
          action cannot be undone.
        </p>

        {errorMessage && (
          <p className="mt-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm" style={{ fontFamily: "Inter" }}>
            {errorMessage}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-10 border border-[#DDDDDD] text-sm text-[#333333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
            style={{ fontFamily: "Inter" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 h-10 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ fontFamily: "Inter" }}
          >
            {isPending ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Deleting…
              </>
            ) : (
              "Delete Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
