'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  /** productId for base items; `${productId}__${variantId}` when a variant is selected */
  id: string;
  /** Always the base product ID — used for order payload */
  productId: string;
  name: string;
  price: number;
  discountPrice: number | null;
  thumbnail: string | null;
  quantity: number;
  stock: number;
  /** Human-readable variant description, e.g. "Color: Oak · Size: Large" */
  variantLabel?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'quantity'>; quantity: number }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; items: CartItem[] };

// ── Reducer ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'milan-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: Math.min(i.quantity + action.quantity, i.stock) }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: action.quantity }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id
            ? { ...i, quantity: Math.min(Math.max(1, action.quantity), i.stock) }
            : i,
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'HYDRATE':
      return {
        ...state,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: action.items.map((item: any) => ({
          ...item,
          productId: item.productId ?? item.id,
        })),
      };
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: 'HYDRATE', items: JSON.parse(stored) });
    } catch {}
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => {
    const price = i.discountPrice ?? i.price;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        totalPrice,
        addItem: (item, quantity = 1) =>
          dispatch({ type: 'ADD_ITEM', item, quantity }),
        removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
        updateQuantity: (id, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', id, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        openCart: () => dispatch({ type: 'OPEN' }),
        closeCart: () => dispatch({ type: 'CLOSE' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
