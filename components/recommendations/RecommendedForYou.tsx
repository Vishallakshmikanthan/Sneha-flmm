'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRecommendationStore } from '@/lib/store/recommendationStore';
import type { RecommendedArtwork } from '@/types/recommendation';
import Link from 'next/link';

// ============================================================================
// Recommended For You Component
// ============================================================================

interface RecommendedForYouProps {
    limit?: number;
}

export function RecommendedForYou({ limit = 6 }: RecommendedForYouProps) {
    const [recommendations, setRecommendations] = useState<RecommendedArtwork[]>([]);
    const [loading, setLoading] = useState(true);
    const sessionId = useRecommendationStore((state) => state.sessionId);
    const userId = useRecommendationStore((state) => state.userId);
    const isPersonalizationEnabled = useRecommendationStore(
        (state) => state.isPersonalizationEnabled()
    );

    const fetchRecommendations = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                sessionId,
                context: 'homepage',
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
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setLoading(false);
        }
    }, [sessionId, userId, limit]);

    useEffect(() => {
        if (!isPersonalizationEnabled) {
            setLoading(false);
            return;
        }

        fetchRecommendations();
    }, [isPersonalizationEnabled, fetchRecommendations]);

    if (!isPersonalizationEnabled || recommendations.length === 0) {
        return null;
    }

    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4">
                        Recommended for You
                    </h2>
                    <p className="text-text-muted text-lg">
                        Curated artworks based on your taste
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: limit }).map((_, i) => (
                            <div
                                key={i}
                                className="h-96 bg-midnight-800/50 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* Recommendations Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendations.map((rec, index) => (
                            <RecommendationCard
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
// Recommendation Card Component
// ============================================================================

interface RecommendationCardProps {
    recommendation: RecommendedArtwork;
    index: number;
}

function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
    const { artwork, reason } = recommendation;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/artwork/${artwork.id}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-midnight-800/50 backdrop-blur-sm border border-midnight-700 hover:border-gold/30 transition-all duration-500">
                    {/* Image Container */}
                    <div className="relative h-80 overflow-hidden">
                        {/* Placeholder for image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-midnight-700 to-midnight-900" />

                        {/* Image overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                        {/* Reason badge */}
                        {reason && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-midnight-950/80 backdrop-blur-sm rounded-full border border-gold/20">
                                <p className="text-xs text-gold">{reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h3 className="font-playfair text-2xl text-white mb-2 group-hover:text-gold transition-colors duration-300">
                            {artwork.title}
                        </h3>
                        <p className="text-text-muted mb-4">{artwork.artist}</p>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-muted">
                                {artwork.category}
                            </span>
                            <span className="text-gold font-semibold">
                                ${artwork.price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-glow-blue/10 to-glow-cyan/10" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
