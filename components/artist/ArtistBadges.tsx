'use client';

import { ArtistBadge } from '@/types/artist-ecosystem';
import { getBadgeDefinition } from '@/lib/reputation-calculator';
import { motion } from 'framer-motion';

interface ArtistBadgesProps {
    badges: ArtistBadge[];
    size?: 'sm' | 'md' | 'lg';
    showTooltip?: boolean;
}

export default function ArtistBadges({
    badges,
    size = 'md',
    showTooltip = true
}: ArtistBadgesProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((badge) => {
                const definition = getBadgeDefinition(badge);

                return (
                    <motion.div
                        key={badge}
                        className="group relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Badge Icon */}
                        <div
                            className={`${sizeClasses[size]} rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg`}
                            style={{
                                background: `linear-gradient(135deg, ${definition.color}40, ${definition.color}20)`,
                            }}
                        >
                            {/* Icon placeholder - in production, use actual SVG icons */}
                            <div
                                className={`${textSizeClasses[size]} font-bold`}
                                style={{ color: definition.color }}
                            >
                                {getBadgeIcon(badge)}
                            </div>
                        </div>

                        {/* Tooltip */}
                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                <div className="bg-[#0B0F1A] border border-[#D4AF37]/30 rounded-lg p-3 shadow-2xl backdrop-blur-xl min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: definition.color }}
                                        />
                                        <p className="text-sm font-semibold text-white">
                                            {definition.name}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-300 mb-2">
                                        {definition.description}
                                    </p>
                                    <p className="text-xs text-gray-400 italic">
                                        {definition.criteria}
                                    </p>
                                    {/* Tooltip arrow */}
                                    <div
                                        className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
                                        style={{
                                            width: 0,
                                            height: 0,
                                            borderLeft: '6px solid transparent',
                                            borderRight: '6px solid transparent',
                                            borderTop: '6px solid #D4AF37',
                                            opacity: 0.3,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

/**
 * Get badge icon/emoji representation
 * In production, replace with actual SVG icons
 */
function getBadgeIcon(badge: ArtistBadge): string {
    const icons: Record<ArtistBadge, string> = {
        rising_star: '⭐',
        master_artist: '👑',
        collector_favorite: '❤️',
        limited_edition_specialist: '💎',
        verified_artist: '✓',
        featured_artist: '🌟',
        top_seller: '🏆',
        quick_responder: '⚡',
    };

    return icons[badge] || '•';
}
