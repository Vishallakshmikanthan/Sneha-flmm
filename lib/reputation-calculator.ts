import {
    ReputationMetrics,
    ArtistBadge,
    BadgeDefinition
} from '@/types/artist-ecosystem';

/**
 * Calculate artist reputation score based on various metrics
 * Score is 0-100
 */
export function calculateReputationScore(metrics: ReputationMetrics): number {
    const weights = {
        salesVolume: 0.3,
        customerRatings: 0.25,
        returnRate: 0.15,
        engagementRate: 0.15,
        responseTime: 0.1,
        completionRate: 0.05,
    };

    // Normalize sales volume (assume 100 sales = max score)
    const salesScore = Math.min((metrics.salesVolume / 100) * 100, 100);

    // Customer ratings (already 0-5, convert to 0-100)
    const ratingsScore = (metrics.customerRatings.average / 5) * 100;

    // Return rate (lower is better, invert the score)
    const returnScore = Math.max(100 - metrics.returnRate * 10, 0);

    // Engagement rate (already percentage)
    const engagementScore = metrics.engagementRate;

    // Response time (lower is better, assume 24 hours = 0 score, 0 hours = 100 score)
    const responseScore = Math.max(100 - (metrics.responseTime / 24) * 100, 0);

    // Completion rate (already percentage)
    const completionScore = metrics.completionRate;

    const totalScore =
        salesScore * weights.salesVolume +
        ratingsScore * weights.customerRatings +
        returnScore * weights.returnRate +
        engagementScore * weights.engagementRate +
        responseScore * weights.responseTime +
        completionScore * weights.completionRate;

    return Math.round(totalScore);
}

/**
 * Determine which badges an artist should receive based on their metrics
 */
export function calculateBadges(
    metrics: ReputationMetrics,
    reputationScore: number,
    artistData: {
        totalSales: number;
        joinedAt: Date;
        featured: boolean;
        hasLimitedEditions: boolean;
    }
): ArtistBadge[] {
    const badges: ArtistBadge[] = [];

    // Rising Star: New artist (< 6 months) with good performance
    const monthsSinceJoined =
        (Date.now() - artistData.joinedAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsSinceJoined < 6 && reputationScore >= 70) {
        badges.push('rising_star');
    }

    // Master Artist: High reputation score and sales
    if (reputationScore >= 85 && metrics.salesVolume >= 50) {
        badges.push('master_artist');
    }

    // Collector Favorite: High average rating with many reviews
    if (
        metrics.customerRatings.average >= 4.5 &&
        metrics.customerRatings.count >= 20
    ) {
        badges.push('collector_favorite');
    }

    // Limited Edition Specialist: Has limited editions and good sales
    if (artistData.hasLimitedEditions && metrics.salesVolume >= 20) {
        badges.push('limited_edition_specialist');
    }

    // Verified Artist: Always included if artist is verified
    badges.push('verified_artist');

    // Featured Artist: Featured status
    if (artistData.featured) {
        badges.push('featured_artist');
    }

    // Top Seller: Very high sales volume
    if (metrics.salesVolume >= 100) {
        badges.push('top_seller');
    }

    // Quick Responder: Fast response time
    if (metrics.responseTime <= 2) {
        // 2 hours or less
        badges.push('quick_responder');
    }

    return badges;
}

/**
 * Get badge definitions for display
 */
export function getBadgeDefinitions(): Record<ArtistBadge, BadgeDefinition> {
    return {
        rising_star: {
            badge: 'rising_star',
            name: 'Rising Star',
            description: 'New artist showing exceptional promise',
            criteria: 'Joined within 6 months with 70+ reputation score',
            iconUrl: '/icons/badges/rising-star.svg',
            color: '#FFD700',
        },
        master_artist: {
            badge: 'master_artist',
            name: 'Master Artist',
            description: 'Established artist with proven excellence',
            criteria: '85+ reputation score and 50+ sales',
            iconUrl: '/icons/badges/master-artist.svg',
            color: '#9B59B6',
        },
        collector_favorite: {
            badge: 'collector_favorite',
            name: 'Collector Favorite',
            description: 'Highly rated by art collectors',
            criteria: '4.5+ average rating with 20+ reviews',
            iconUrl: '/icons/badges/collector-favorite.svg',
            color: '#E74C3C',
        },
        limited_edition_specialist: {
            badge: 'limited_edition_specialist',
            name: 'Limited Edition Specialist',
            description: 'Expert in creating exclusive limited editions',
            criteria: 'Has limited editions with 20+ sales',
            iconUrl: '/icons/badges/limited-edition.svg',
            color: '#3498DB',
        },
        verified_artist: {
            badge: 'verified_artist',
            name: 'Verified Artist',
            description: 'Identity verified by platform',
            criteria: 'Completed identity verification',
            iconUrl: '/icons/badges/verified.svg',
            color: '#2ECC71',
        },
        featured_artist: {
            badge: 'featured_artist',
            name: 'Featured Artist',
            description: 'Selected for platform featuring',
            criteria: 'Curated by platform team',
            iconUrl: '/icons/badges/featured.svg',
            color: '#F39C12',
        },
        top_seller: {
            badge: 'top_seller',
            name: 'Top Seller',
            description: 'Exceptional sales performance',
            criteria: '100+ total sales',
            iconUrl: '/icons/badges/top-seller.svg',
            color: '#1ABC9C',
        },
        quick_responder: {
            badge: 'quick_responder',
            name: 'Quick Responder',
            description: 'Responds to inquiries promptly',
            criteria: 'Average response time ≤ 2 hours',
            iconUrl: '/icons/badges/quick-responder.svg',
            color: '#34495E',
        },
    };
}

/**
 * Get badge definition by badge type
 */
export function getBadgeDefinition(badge: ArtistBadge): BadgeDefinition {
    return getBadgeDefinitions()[badge];
}

/**
 * Calculate reputation change
 */
export function calculateReputationChange(
    previousScore: number,
    newScore: number
): { change: number; direction: 'up' | 'down' | 'stable' } {
    const change = newScore - previousScore;
    let direction: 'up' | 'down' | 'stable' = 'stable';

    if (change > 0) {
        direction = 'up';
    } else if (change < 0) {
        direction = 'down';
    }

    return { change, direction };
}
