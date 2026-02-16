import {
    CommissionTier,
    CommissionCalculation,
    COMMISSION_RATES
} from '@/types/artist-ecosystem';

/**
 * Calculate commission for an artwork sale
 */
export function calculateCommission(
    salePrice: number,
    commissionTier: CommissionTier,
    artworkId: string
): CommissionCalculation {
    const commissionRate = COMMISSION_RATES[commissionTier];
    const commissionAmount = (salePrice * commissionRate) / 100;
    const artistPayout = salePrice - commissionAmount;

    return {
        artworkId,
        salePrice,
        commissionTier,
        commissionRate,
        commissionAmount,
        artistPayout,
        calculatedAt: new Date(),
    };
}

/**
 * Get commission tier for an artist
 */
export function getArtistCommissionTier(
    featured: boolean,
    isLimitedEdition: boolean
): CommissionTier {
    if (isLimitedEdition) {
        return 'limited_edition';
    }
    if (featured) {
        return 'featured';
    }
    return 'base';
}

/**
 * Calculate net payout after commission
 */
export function calculateNetPayout(
    totalSales: number,
    commissionTier: CommissionTier
): number {
    const commissionRate = COMMISSION_RATES[commissionTier];
    const totalCommission = (totalSales * commissionRate) / 100;
    return totalSales - totalCommission;
}

/**
 * Format commission rate for display
 */
export function formatCommissionRate(tier: CommissionTier): string {
    const rate = COMMISSION_RATES[tier];
    return `${rate}%`;
}

/**
 * Get commission tier description
 */
export function getCommissionTierDescription(tier: CommissionTier): string {
    const descriptions: Record<CommissionTier, string> = {
        base: 'Standard commission rate for approved artists',
        featured: 'Reduced commission rate for featured artists',
        limited_edition: 'Premium commission rate for limited edition artworks',
    };
    return descriptions[tier];
}
