"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "@/lib/data/artworks";

export default function FilterBar() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("featured");

    return (
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between py-8 border-b border-gold/20">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory("all")}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === "all"
                            ? "bg-gold text-midnight-950"
                            : "glass text-text-muted hover:text-gold hover:border-gold"
                        }`}
                >
                    All
                </motion.button>
                {categories.slice(0, 6).map((category) => (
                    <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === category.id
                                ? "bg-gold text-midnight-950"
                                : "glass text-text-muted hover:text-gold hover:border-gold"
                            }`}
                    >
                        {category.name}
                    </motion.button>
                ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3">
                <span className="text-text-muted text-sm">Sort by:</span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-full glass border border-gold/20 focus:border-gold focus:outline-none text-text-primary bg-transparent cursor-pointer"
                >
                    <option value="featured" className="bg-midnight-900">Featured</option>
                    <option value="price-low" className="bg-midnight-900">Price: Low to High</option>
                    <option value="price-high" className="bg-midnight-900">Price: High to Low</option>
                    <option value="newest" className="bg-midnight-900">Newest</option>
                    <option value="oldest" className="bg-midnight-900">Oldest</option>
                </select>
            </div>
        </div>
    );
}
