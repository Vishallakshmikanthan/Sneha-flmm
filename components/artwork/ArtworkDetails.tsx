"use client";

import { motion } from "framer-motion";
import { Artwork } from "@/types/artwork";
import { formatPrice } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

interface ArtworkDetailsProps {
    artwork: Artwork;
}

export default function ArtworkDetails({ artwork }: ArtworkDetailsProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Artwork Display */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="sticky top-32">
                        <div className="aspect-square rounded-3xl glass p-8">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gold/20 to-glow-blue/20 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-9xl mb-4">🎨</p>
                                    <p className="text-text-muted">3D Rotating Frame</p>
                                    <p className="text-text-muted/50 text-sm mt-2">
                                        (Placeholder for Three.js viewer)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Artwork Information */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-8"
                >
                    {/* Title & Artist */}
                    <div>
                        <h1 className="text-5xl md:text-7xl font-display mb-4 text-gold">
                            {artwork.title}
                        </h1>
                        <p className="text-2xl text-text-muted mb-2">{artwork.artist}</p>
                        <p className="text-text-muted/70">{artwork.era}</p>
                    </div>

                    {/* Price & Stock */}
                    <div className="py-6 border-y border-gold/20">
                        <p className="text-4xl font-semibold text-gold mb-2">
                            {formatPrice(artwork.price)}
                        </p>
                        {artwork.inStock ? (
                            <p className="text-sm text-green-400">In Stock</p>
                        ) : (
                            <p className="text-sm text-red-400">Sold Out</p>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-text-muted mb-1">Year</p>
                                <p className="text-text-primary">{artwork.year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted mb-1">Medium</p>
                                <p className="text-text-primary">{artwork.medium}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted mb-1">Dimensions</p>
                                <p className="text-text-primary">{artwork.dimensions}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted mb-1">Category</p>
                                <p className="text-text-primary">{artwork.category}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xl font-display mb-3 text-gold">About</h3>
                        <p className="text-text-muted leading-relaxed">
                            {artwork.description}
                        </p>
                    </div>

                    {/* Limited Edition Badge */}
                    {artwork.limitedEdition && (
                        <div className="glass p-4 rounded-2xl border border-gold/30">
                            <p className="text-sm text-gold mb-1">Limited Edition</p>
                            <p className="text-text-muted text-sm">
                                {artwork.limitedEdition.remaining} of{" "}
                                {artwork.limitedEdition.totalSupply} remaining
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <MagneticButton
                            variant="primary"
                            size="lg"
                            className="flex-1"
                            onClick={() => console.log("Add to cart")}
                        >
                            Add to Cart
                        </MagneticButton>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-5 glass border-2 border-gold/30 rounded-full text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300"
                        >
                            ♡
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
