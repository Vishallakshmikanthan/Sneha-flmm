"use client";

import { motion } from "framer-motion";
import { CartItem as CartItemType } from "@/lib/store/cartStore";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
    item: CartItemType;
    index: number;
}

export default function CartItem({ item, index }: CartItemProps) {
    const { removeItem, updateQuantity } = useCartStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass rounded-2xl p-6 flex gap-6"
        >
            {/* Artwork Image */}
            <div className="w-32 h-32 flex-shrink-0 rounded-xl bg-gradient-to-br from-gold/20 to-glow-blue/20 flex items-center justify-center">
                <p className="text-4xl">🎨</p>
            </div>

            {/* Item Details */}
            <div className="flex-1">
                <h3 className="text-xl font-display mb-1 text-gold">{item.title}</h3>
                <p className="text-sm text-text-muted mb-2">{item.artist}</p>
                <p className="text-lg font-semibold text-gold">
                    {formatPrice(item.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm text-text-muted">Quantity:</span>
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full glass border border-gold/30 hover:border-gold flex items-center justify-center text-gold"
                        >
                            −
                        </motion.button>
                        <span className="w-12 text-center text-text-primary">
                            {item.quantity}
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full glass border border-gold/30 hover:border-gold flex items-center justify-center text-gold"
                        >
                            +
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Remove Button */}
            <div className="flex flex-col justify-between items-end">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </motion.button>

                <p className="text-lg font-semibold text-gold">
                    {formatPrice(item.price * item.quantity)}
                </p>
            </div>
        </motion.div>
    );
}
