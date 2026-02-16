'use client';

import { CuratedCollection } from '@/types/artist-ecosystem';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeaturedCollectionsProps {
    collections: CuratedCollection[];
}

export default function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
    if (collections.length === 0) {
        return null;
    }

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Curated Collections
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Thoughtfully curated selections exploring themes, movements, and stories
                    </p>
                </motion.div>

                {/* Collections Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Link href={`/collections/${collection.slug}`}>
                                <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer">
                                    {/* Collection Image */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${collection.coverImageUrl})` }}
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/50 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        {/* Theme Badge */}
                                        <div className="mb-3">
                                            <span className="px-3 py-1 bg-[#D4AF37]/20 backdrop-blur-md border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                                                {collection.theme.replace('_', ' ')}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                                            {collection.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                            {collection.description}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{collection.artworkIds.length} artworks</span>
                                            <span>Curated by {collection.curatorName}</span>
                                        </div>

                                        {/* Hover Border */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37] rounded-2xl transition-colors duration-300" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Link */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/collections"
                        className="inline-block px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                    >
                        View All Collections →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
