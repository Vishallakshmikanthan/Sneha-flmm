import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artwork } from '@/types/artwork';

export interface CartItem extends Artwork {
    quantity: number;
    addedAt: Date;
}

interface CartStore {
    items: CartItem[];
    addItem: (artwork: Artwork) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (artwork) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === artwork.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === artwork.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            { ...artwork, quantity: 1, addedAt: new Date() },
                        ],
                    });
                }
            },

            removeItem: (id) => {
                set({
                    items: get().items.filter((item) => item.id !== id),
                });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'starry-night-cart',
        }
    )
);
