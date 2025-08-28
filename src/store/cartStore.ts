import { CartItem } from "@/types/cardItem";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
    items: CartItem[];
    addToCart: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (productId) => {
                const { items } = get();
                const existingItem = items.find((item) => item.productId === productId);

                if (existingItem) {
                    const updateitems = items.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + 1 } : item
                    );
                    set({ items: updateitems })
                } else {
                    set({ items: [...items, { productId, quantity: 1 }] });
                }
            },
            removeFromCart: (productId) => {
                set({
                    items: get().items.filter((item) => item.productId !== productId),
                });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity < 1) {
                    get().removeFromCart(productId);
                } else {
                    set({
                        items: get().items.map((item) =>
                            item.productId === productId ? { ...item, quantity } : item
                        )
                    });
                }
            },
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage'
        }
    )
);