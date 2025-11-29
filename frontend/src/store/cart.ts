import { create } from "zustand";

type CartItem = {
  productId: number;
  title: string;
  variantId: number;
  variantSku: string;
  price_clp: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (
    product: any,
    variant: { id: number; sku: string; price_clp: number },
    quantity?: number
  ) => void;
  clear: () => void;
  removeItem: (variantId: number) => void;
  increaseQuantity: (variantId: number) => void;
  decreaseQuantity: (variantId: number) => void;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, variant, quantity = 1) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.variantId === variant.id
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.variantId === variant.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            title: product.title,
            variantId: variant.id,
            variantSku: variant.sku,
            price_clp: variant.price_clp,
            quantity,
          },
        ],
      };
    }),

  clear: () => set({ items: [] }),

  removeItem: (variantId) =>
    set((state) => ({
      items: state.items.filter((i) => i.variantId !== variantId),
    })),

  increaseQuantity: (variantId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    })),

  decreaseQuantity: (variantId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.variantId === variantId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0),
    })),

  totalPrice: () =>
    get().items.reduce(
      (acc, item) => acc + item.price_clp * item.quantity,
      0
    ),
}));
