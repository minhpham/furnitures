"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/app/components/CartDrawer";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch on window focus in development
        refetchOnWindowFocus: process.env.NODE_ENV === "production",
        // Consider data fresh for 60 seconds
        staleTime: 60 * 1000,
        // Retry failed requests once
        retry: 1,
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  // useState ensures a unique QueryClient per component tree (SSR-safe)
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
