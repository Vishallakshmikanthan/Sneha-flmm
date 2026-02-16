"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { useRouter } from "next/navigation";

export default function CartSummary() {
    const router = useRouter();
    const total = useCartStore((state) => state.getTotal());
    const itemCount = useCartStore((state) => state.getItemCount());

    const shipping = 0; // Free shipping
    const tax = total * 0.1; // 10% tax
    const finalTotal = total + shipping + tax;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sticky top-32 glass rounded-2xl p-8"
        >
            <h2 className="text-2xl font-display mb-6 text-gold">Order Summary</h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-muted">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-text-muted">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(tax)}</span>
                </div>
                <div className="h-px bg-gold/20" />
                <div className="flex justify-between text-xl font-semibold">
                    <span className="text-text-primary">Total</span>
                    <span className="text-gold">{formatPrice(finalTotal)}</span>
                </div>
            </div>

            <MagneticButton
                variant="primary"
                size="lg"
                className="w-full mb-4"
                onClick={() => router.push("/checkout")}
            >
                Proceed to Checkout
            </MagneticButton>

            <p className="text-xs text-text-muted text-center">
                Secure checkout powered by Stripe
            </p>
        </motion.div>
    );
}
