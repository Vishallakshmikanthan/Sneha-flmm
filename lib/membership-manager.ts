// Membership Manager - Business Logic for Collector Membership System

import {
    MembershipTier,
    CollectorSubscription,
    MembershipBenefits,
    TierProgress,
    MEMBERSHIP_TIERS,
    TIER_PROGRESSION,
} from '@/types/membership';

// ============================================================================
// Tier Calculation
// ============================================================================

export function calculateMembershipTier(
    totalPurchases: number,
    totalSpend: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _hasActiveSubscription: boolean = false
): MembershipTier {
    // Platinum is invite-only, cannot be auto-calculated
    if (totalPurchases >= TIER_PROGRESSION.gold.minimumPurchases! &&
        totalSpend >= TIER_PROGRESSION.gold.minimumSpend!) {
        return 'gold';
    }

    if (totalPurchases >= TIER_PROGRESSION.silver.minimumPurchases! &&
        totalSpend >= TIER_PROGRESSION.silver.minimumSpend!) {
        return 'silver';
    }

    return 'bronze';
}

export function getEligibleTier(
    totalPurchases: number,
    totalSpend: number
): MembershipTier {
    return calculateMembershipTier(totalPurchases, totalSpend);
}

// ============================================================================
// Benefits Management
// ============================================================================

export function getMembershipBenefits(tier: MembershipTier): MembershipBenefits {
    const tierDef = MEMBERSHIP_TIERS[tier];

    return {
        tier,
        earlyAccessEnabled: true,
        earlyAccessHours: tierDef.earlyAccessHours,
        personalizedRecommendations: tier !== 'bronze',
        conciergeService: tier === 'gold' || tier === 'platinum',
        eventInvitations: tier !== 'bronze',
        prioritySupport: true,
        customCommissions: tier === 'platinum',
    };
}

export function checkEarlyAccessEligibility(
    tier: MembershipTier,
    subscriptionActive: boolean,
    dropReleaseTime: Date,
    currentTime: Date = new Date()
): boolean {
    if (!subscriptionActive) {
        return false;
    }

    const tierDef = MEMBERSHIP_TIERS[tier];
    const earlyAccessWindowMs = tierDef.earlyAccessHours * 60 * 60 * 1000;
    const earlyAccessStartTime = new Date(dropReleaseTime.getTime() - earlyAccessWindowMs);

    return currentTime >= earlyAccessStartTime && currentTime < dropReleaseTime;
}

// ============================================================================
// Tier Progression
// ============================================================================

export function calculateTierProgress(
    currentTier: MembershipTier,
    totalPurchases: number,
    totalSpend: number,
    engagementScore: number = 0
): TierProgress {
    const nextTier = getNextTier(currentTier);

    if (!nextTier) {
        // Already at highest tier or platinum (invite-only)
        return {
            collectorId: '', // Will be set by caller
            currentTier,
            progress: {
                purchases: totalPurchases,
                totalSpend,
                engagement: engagementScore,
            },
            requirements: TIER_PROGRESSION[currentTier],
            percentComplete: 100,
            eligible: false,
        };
    }

    const requirements = TIER_PROGRESSION[nextTier];
    const purchaseProgress = requirements.minimumPurchases
        ? (totalPurchases / requirements.minimumPurchases) * 100
        : 100;
    const spendProgress = requirements.minimumSpend
        ? (totalSpend / requirements.minimumSpend) * 100
        : 100;

    const percentComplete = Math.min(
        Math.min(purchaseProgress, spendProgress),
        100
    );

    const eligible = totalPurchases >= (requirements.minimumPurchases || 0) &&
        totalSpend >= (requirements.minimumSpend || 0);

    return {
        collectorId: '', // Will be set by caller
        currentTier,
        nextTier,
        progress: {
            purchases: totalPurchases,
            totalSpend,
            engagement: engagementScore,
        },
        requirements,
        percentComplete,
        eligible,
    };
}

function getNextTier(currentTier: MembershipTier): MembershipTier | null {
    const tierOrder: MembershipTier[] = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tierOrder.indexOf(currentTier);

    if (currentIndex === -1 || currentIndex >= tierOrder.length - 1) {
        return null;
    }

    const nextTier = tierOrder[currentIndex + 1];

    // Platinum is invite-only, skip it for auto-progression
    if (nextTier === 'platinum') {
        return null;
    }

    return nextTier;
}

// ============================================================================
// Engagement Tracking
// ============================================================================

export function calculateEngagementScore(
    artworkViews: number,
    purchases: number,
    wishlistAdditions: number,
    eventAttendance: number,
    supportInteractions: number
): number {
    // Weighted engagement score (0-100)
    const weights = {
        purchases: 40,
        wishlistAdditions: 20,
        artworkViews: 15,
        eventAttendance: 15,
        supportInteractions: 10,
    };

    // Normalize values (assuming reasonable maximums)
    const normalizedPurchases = Math.min(purchases / 10, 1);
    const normalizedWishlist = Math.min(wishlistAdditions / 20, 1);
    const normalizedViews = Math.min(artworkViews / 100, 1);
    const normalizedEvents = Math.min(eventAttendance / 5, 1);
    const normalizedSupport = Math.min(supportInteractions / 10, 1);

    const score =
        (normalizedPurchases * weights.purchases) +
        (normalizedWishlist * weights.wishlistAdditions) +
        (normalizedViews * weights.artworkViews) +
        (normalizedEvents * weights.eventAttendance) +
        (normalizedSupport * weights.supportInteractions);

    return Math.round(score);
}

// ============================================================================
// Subscription Management
// ============================================================================

export function isSubscriptionActive(subscription: CollectorSubscription): boolean {
    if (subscription.status === 'cancelled' || subscription.status === 'expired') {
        return false;
    }

    if (subscription.status === 'past_due') {
        // Grace period of 7 days
        const gracePeriodMs = 7 * 24 * 60 * 60 * 1000;
        const gracePeriodEnd = new Date(subscription.renewsAt.getTime() + gracePeriodMs);
        return new Date() < gracePeriodEnd;
    }

    return subscription.status === 'active' || subscription.status === 'trial';
}

export function calculateRenewalDate(
    startDate: Date,
    billingCycle: 'monthly' | 'annual'
): Date {
    const renewalDate = new Date(startDate);

    if (billingCycle === 'monthly') {
        renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    return renewalDate;
}

export function calculateSubscriptionPrice(
    tier: MembershipTier,
    billingCycle: 'monthly' | 'annual',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _discountCode?: string
): number {
    const tierDef = MEMBERSHIP_TIERS[tier];
    let price = tierDef.price;

    // Annual discount: 2 months free (16.67% off)
    if (billingCycle === 'annual') {
        price = price * 10; // 10 months instead of 12
    }

    // Apply discount code if provided
    // This would integrate with a discount system

    return price;
}

// ============================================================================
// Metrics & Analytics
// ============================================================================

export function trackMembershipMetrics(subscriptions: CollectorSubscription[]): {
    tierDistribution: Record<MembershipTier, number>;
    totalSubscribers: number;
    monthlyRecurringRevenue: number;
    activeSubscriptions: number;
} {
    const tierDistribution: Record<MembershipTier, number> = {
        bronze: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
    };

    let totalSubscribers = 0;
    let monthlyRecurringRevenue = 0;
    let activeSubscriptions = 0;

    subscriptions.forEach(sub => {
        if (isSubscriptionActive(sub)) {
            tierDistribution[sub.tier]++;
            activeSubscriptions++;

            const tierPrice = MEMBERSHIP_TIERS[sub.tier].price;
            if (sub.billingCycle === 'monthly') {
                monthlyRecurringRevenue += tierPrice;
            } else {
                // Convert annual to monthly
                monthlyRecurringRevenue += (tierPrice * 10) / 12;
            }
        }
        totalSubscribers++;
    });

    return {
        tierDistribution,
        totalSubscribers,
        monthlyRecurringRevenue,
        activeSubscriptions,
    };
}

// ============================================================================
// Utility Functions
// ============================================================================

export function getTierDisplayName(tier: MembershipTier): string {
    return MEMBERSHIP_TIERS[tier].name;
}

export function getTierColor(tier: MembershipTier): string {
    return MEMBERSHIP_TIERS[tier].color;
}

export function getTierIcon(tier: MembershipTier): string {
    return MEMBERSHIP_TIERS[tier].icon;
}

export function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
}
