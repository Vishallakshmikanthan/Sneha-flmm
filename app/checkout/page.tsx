"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

export default function CheckoutPage() {
    const items = useCartStore((state) => state.items);
    const total = useCartStore((state) => state.getTotal());
    const tax = total * 0.1;
    const finalTotal = total + tax;

    return (
        <main className="min-h-screen pt-32 pb-16">
            <div className="max-w-5xl mx-auto px-4 md:px-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-display mb-4 text-gold">
                        Checkout
                    </h1>
                    <p className="text-text-muted">Complete your purchase</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="glass rounded-2xl p-8 space-y-8"
                        >
                            {/* Contact Information */}
                            <div>
                                <h2 className="text-2xl font-display mb-4 text-gold">
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full px-6 py-4 rounded-full glass border border-gold/20 focus:border-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h2 className="text-2xl font-display mb-4 text-gold">
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="First name"
                                            className="px-6 py-4 rounded-full glass border border-gold/20 focus:border-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Last name"
                                            className="px-6 py-4 rounded-full glass border border-gold/20 focus:border-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="w-full px-6 py-4 rounded-full glass border border-gold/20 focus:border-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            className="px-6 py-4 rounded-full glass border border-gold/20 focus:border-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Postal code"
                                            className="px-6 py-4 rounded-full glass border border-gold/20 focus:border-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h2 className="text-2xl font-display mb-4 text-gold">
                                    Payment Method
                                </h2>
                                <div className="glass rounded-2xl p-6 border border-gold/30">
                                    <p className="text-text-muted text-center">
                                        Stripe integration placeholder
                                    </p>
                                    <p className="text-text-muted/50 text-sm text-center mt-2">
                                        Secure payment processing
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="sticky top-32 glass rounded-2xl p-8"
                        >
                            <h2 className="text-2xl font-display mb-6 text-gold">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold/20 to-glow-blue/20 flex items-center justify-center flex-shrink-0">
                                            <p className="text-2xl">🎨</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-text-primary line-clamp-1">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-text-muted">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gold">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-text-muted">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-text-muted">
                                    <span>Shipping</span>
                                    <span className="text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between text-text-muted">
                                    <span>Tax</span>
                                    <span>{formatPrice(tax)}</span>
                                </div>
                                <div className="h-px bg-gold/20" />
                                <div className="flex justify-between text-xl font-semibold">
                                    <span className="text-text-primary">Total</span>
                                    <span className="text-gold">{formatPrice(finalTotal)}</span>
                                </div>
                            </div>

                            <MagneticButton variant="primary" size="lg" className="w-full">
                                Place Order
                            </MagneticButton>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
