'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRecommendationStore } from '@/lib/store/recommendationStore';
import type { RecommendedArtwork } from '@/types/recommendation';
import Link from 'next/link';

// ============================================================================
// Similar Artworks Component
// ============================================================================

interface SimilarArtworksProps {
    currentArtworkId: string;
    currentArtworkTitle: string;
    limit?: number;
}

export function SimilarArtworks({
    currentArtworkId,
    currentArtworkTitle,
    limit = 4,
}: SimilarArtworksProps) {
    const [recommendations, setRecommendations] = useState<RecommendedArtwork[]>([]);
    const [loading, setLoading] = useState(true);
    const sessionId = useRecommendationStore((state) => state.sessionId);
    const userId = useRecommendationStore((state) => state.userId);

    const fetchSimilarArtworks = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                sessionId,
                context: 'artwork_detail',
                currentArtworkId,
                limit: limit.toString(),
            });

            if (userId) {
                params.append('userId', userId);
            }

            const response = await fetch(`/api/recommendations?${params}`);
            const data = await response.json();

            if (data.success && data.data) {
                setRecommendations(data.data.recommendations);
            }
        } catch (error) {
            console.error('Failed to fetch similar artworks:', error);
        } finally {
            setLoading(false);
        }
    }, [sessionId, userId, currentArtworkId, limit]);

    useEffect(() => {
        fetchSimilarArtworks();
    }, [fetchSimilarArtworks]);

    if (recommendations.length === 0 && !loading) {
        return null;
    }

    return (
        <section className="py-16 px-6 bg-midnight-900/30">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="font-playfair text-3xl md:text-4xl text-white mb-2">
                        Similar Artworks
                    </h2>
                    <p className="text-text-muted">
                        Because you&apos;re viewing{' '}
                        <span className="text-gold">{currentArtworkTitle}</span>
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: limit }).map((_, i) => (
                            <div
                                key={i}
                                className="h-80 bg-midnight-800/50 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* Recommendations Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendations.map((rec, index) => (
                            <SimilarArtworkCard
                                key={rec.artworkId}
                                recommendation={rec}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ============================================================================
// Similar Artwork Card Component
// ============================================================================

interface SimilarArtworkCardProps {
    recommendation: RecommendedArtwork;
    index: number;
}

function SimilarArtworkCard({ recommendation, index }: SimilarArtworkCardProps) {
    const { artwork } = recommendation;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
        >
            <Link href={`/artwork/${artwork.id}`}>
                <div className="group relative overflow-hidden rounded-xl bg-midnight-800/40 backdrop-blur-sm border border-midnight-700/50 hover:border-gold/40 transition-all duration-500 hover:scale-105">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                        {/* Placeholder for image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-midnight-700 to-midnight-900" />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="font-playfair text-lg text-white mb-1 group-hover:text-gold transition-colors duration-300 truncate">
                            {artwork.title}
                        </h3>
                        <p className="text-sm text-text-muted mb-2 truncate">
                            {artwork.artist}
                        </p>
                        <p className="text-gold font-semibold text-sm">
                            ${artwork.price.toLocaleString()}
                        </p>
                    </div>

                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-glow-blue/5 to-transparent" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
