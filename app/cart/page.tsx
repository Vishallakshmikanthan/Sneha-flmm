"use client";

import { useCartStore } from "@/lib/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import { motion } from "framer-motion";

export default function CartPage() {
    const items = useCartStore((state) => state.items);

    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <main className="min-h-screen pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-display mb-4 text-gold">
                        Shopping Cart
                    </h1>
                    <p className="text-text-muted">
                        {items.length} {items.length === 1 ? "item" : "items"} in your cart
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item, index) => (
                            <CartItem key={item.id} item={item} index={index} />
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary />
                    </div>
                </div>
            </div>
        </main>
    );
}
