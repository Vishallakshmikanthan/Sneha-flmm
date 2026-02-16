// Collector Membership System Type Definitions

// ============================================================================
// Membership Tiers
// ============================================================================

export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface MembershipTierDefinition {
    tier: MembershipTier;
    name: string;
    description: string;
    price: number; // USD per month
    earlyAccessHours: number; // Hours before public release
    benefits: string[];
    color: string; // Brand color for tier badge
    icon: string; // Emoji or icon identifier
}

export const MEMBERSHIP_TIERS: Record<MembershipTier, MembershipTierDefinition> = {
    bronze: {
        tier: 'bronze',
        name: 'Bronze Collector',
        description: 'Start your art collection journey',
        price: 29,
        earlyAccessHours: 24,
        benefits: [
            'Early access to new releases (24h)',
            'Monthly curated newsletter',
            'Exclusive collector badge',
            'Priority customer support',
        ],
        color: '#CD7F32',
        icon: '🥉',
    },
    silver: {
        tier: 'silver',
        name: 'Silver Collector',
        description: 'Elevate your collecting experience',
        price: 59,
        earlyAccessHours: 48,
        benefits: [
            'Early access to new releases (48h)',
            'Private collection previews',
            'Virtual exhibition invitations',
            'Personalized recommendations',
            'Dedicated account manager',
        ],
        color: '#C0C0C0',
        icon: '🥈',
    },
    gold: {
        tier: 'gold',
        name: 'Gold Collector',
        description: 'Premium access and exclusive perks',
        price: 99,
        earlyAccessHours: 72,
        benefits: [
            'Early access to exclusive drops (72h)',
            'First access to limited editions',
            'Concierge art consultation',
            'Invitations to private events',
            'Complimentary framing service',
            'Artist meet-and-greet access',
        ],
        color: '#D4AF37',
        icon: '🥇',
    },
    platinum: {
        tier: 'platinum',
        name: 'Platinum Collector',
        description: 'Ultimate VIP collecting experience',
        price: 299,
        earlyAccessHours: 168, // 7 days
        benefits: [
            'First access to all releases (7 days)',
            'Personal art curator',
            'Exclusive platinum-only drops',
            'Private studio visits with artists',
            'Complimentary art insurance',
            'VIP physical gallery events',
            'Investment advisory services',
            'Commission custom artworks',
        ],
        color: '#E5E4E2',
        icon: '💎',
    },
};

// ============================================================================
// Collector Subscription
// ============================================================================

export interface CollectorSubscription {
    id: string;
    collectorId: string;
    tier: MembershipTier;
    status: SubscriptionStatus;
    startedAt: Date;
    renewsAt: Date;
    cancelledAt?: Date;
    paymentMethod: PaymentMethod;
    billingCycle: 'monthly' | 'annual';
    discountApplied?: Discount;
}

export type SubscriptionStatus =
    | 'active'
    | 'past_due'
    | 'cancelled'
    | 'expired'
    | 'trial';

export interface PaymentMethod {
    type: 'credit_card' | 'paypal' | 'bank_transfer';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
}

export interface Discount {
    code: string;
    type: 'percentage' | 'fixed_amount';
    value: number;
    description: string;
}

// ============================================================================
// Membership Benefits & Usage
// ============================================================================

export interface MembershipBenefits {
    tier: MembershipTier;
    earlyAccessEnabled: boolean;
    earlyAccessHours: number;
    personalizedRecommendations: boolean;
    conciergeService: boolean;
    eventInvitations: boolean;
    prioritySupport: boolean;
    customCommissions: boolean;
}

export interface MembershipUsage {
    collectorId: string;
    tier: MembershipTier;
    period: {
        startDate: Date;
        endDate: Date;
    };
    metrics: {
        earlyAccessArtworksViewed: number;
        earlyAccessPurchases: number;
        eventsAttended: number;
        conciergeRequests: number;
        supportTickets: number;
    };
}

// ============================================================================
// Tier Progression
// ============================================================================

export interface TierProgressionRequirements {
    tier: MembershipTier;
    minimumPurchases?: number;
    minimumSpend?: number;
    minimumEngagement?: number;
    inviteOnly?: boolean;
}

export const TIER_PROGRESSION: Record<MembershipTier, TierProgressionRequirements> = {
    bronze: {
        tier: 'bronze',
        minimumPurchases: 0,
        minimumSpend: 0,
    },
    silver: {
        tier: 'silver',
        minimumPurchases: 3,
        minimumSpend: 1500,
    },
    gold: {
        tier: 'gold',
        minimumPurchases: 10,
        minimumSpend: 5000,
    },
    platinum: {
        tier: 'platinum',
        minimumPurchases: 25,
        minimumSpend: 15000,
        inviteOnly: true,
    },
};

export interface TierProgress {
    collectorId: string;
    currentTier: MembershipTier;
    nextTier?: MembershipTier;
    progress: {
        purchases: number;
        totalSpend: number;
        engagement: number;
    };
    requirements: TierProgressionRequirements;
    percentComplete: number;
    eligible: boolean;
}

// ============================================================================
// Membership Analytics
// ============================================================================

export interface MembershipMetrics {
    period: {
        startDate: Date;
        endDate: Date;
    };
    tierDistribution: Record<MembershipTier, number>;
    totalSubscribers: number;
    monthlyRecurringRevenue: number;
    churnRate: number;
    upgradeRate: number;
    downgradeRate: number;
    averageLifetimeValue: number;
}

export interface CollectorEngagement {
    collectorId: string;
    tier: MembershipTier;
    engagementScore: number; // 0-100
    lastActiveAt: Date;
    activities: {
        artworkViews: number;
        purchases: number;
        wishlistAdditions: number;
        eventAttendance: number;
        supportInteractions: number;
    };
}

// ============================================================================
// Membership Notifications
// ============================================================================

export interface MembershipNotification {
    id: string;
    collectorId: string;
    type: MembershipNotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    actionLabel?: string;
    sentAt: Date;
    readAt?: Date;
}

export type MembershipNotificationType =
    | 'tier_upgrade_available'
    | 'tier_upgraded'
    | 'early_access_available'
    | 'exclusive_drop_alert'
    | 'event_invitation'
    | 'renewal_reminder'
    | 'payment_failed'
    | 'subscription_cancelled';
