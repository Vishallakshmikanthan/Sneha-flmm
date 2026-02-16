"use client";

import { motion } from "framer-motion";
import { categories } from "@/lib/data/artworks";
import CategoryCard from "@/components/ui/CategoryCard";

export default function CategoryGrid() {
    return (
        <section className="relative py-32 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-7xl font-display mb-6 text-gold">
                        Explore by Era
                    </h2>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Journey through centuries of artistic expression
                    </p>
                </motion.div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category, index) => (
                        <CategoryCard key={category.id} category={category} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
