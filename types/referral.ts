// Artist Referral Program Type Definitions

// ============================================================================
// Referral System
// ============================================================================

export interface ArtistReferral {
    id: string;
    referrerId: string; // Artist who made the referral
    referrerName: string;
    referralCode: string; // Unique code for tracking
    referredEmail: string;
    referredName?: string;
    status: ReferralStatus;
    createdAt: Date;
    convertedAt?: Date;
    applicationId?: string; // Link to artist application
    artistId?: string; // If approved, link to artist profile
}

export type ReferralStatus =
    | 'pending' // Invitation sent, not yet applied
    | 'applied' // Referred artist submitted application
    | 'approved' // Referred artist accepted to platform
    | 'rejected' // Referred artist application rejected
    | 'expired'; // Invitation expired (90 days)

// ============================================================================
// Referral Rewards
// ============================================================================

export interface ReferralReward {
    id: string;
    referralId: string;
    referrerId: string;
    rewardType: ReferralRewardType;
    rewardValue: number;
    status: 'pending' | 'earned' | 'paid' | 'forfeited';
    earnedAt?: Date;
    paidAt?: Date;
    description: string;
}

export type ReferralRewardType =
    | 'commission_bonus' // % reduction in commission for X months
    | 'cash_bonus' // One-time cash payment
    | 'featured_placement' // Free homepage feature
    | 'tier_upgrade'; // Temporary tier upgrade

export const REFERRAL_REWARD_STRUCTURE: Record<ReferralRewardType, {
    value: number;
    description: string;
    eligibility: string;
}> = {
    commission_bonus: {
        value: 5, // 5% commission reduction
        description: '5% commission reduction for 3 months',
        eligibility: 'Referred artist makes first sale',
    },
    cash_bonus: {
        value: 250, // $250 USD
        description: '$250 cash bonus',
        eligibility: 'Referred artist completes 5 sales',
    },
    featured_placement: {
        value: 500, // Value equivalent
        description: 'Free homepage feature (1 week)',
        eligibility: 'Referred artist approved',
    },
    tier_upgrade: {
        value: 0, // No monetary value
        description: 'Upgrade to Featured tier for 6 months',
        eligibility: 'Refer 3+ artists who get approved',
    },
};

// ============================================================================
// Referral Metrics
// ============================================================================

export interface ReferralMetrics {
    artistId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    totalReferrals: number;
    pendingReferrals: number;
    appliedReferrals: number;
    approvedReferrals: number;
    rejectedReferrals: number;
    conversionRate: number; // % of referrals that got approved
    totalRewardsEarned: number; // USD value
    rewardsPaid: number;
    rewardsPending: number;
}

export interface ReferralLeaderboard {
    period: {
        startDate: Date;
        endDate: Date;
    };
    topReferrers: ReferrerRank[];
}

export interface ReferrerRank {
    rank: number;
    artistId: string;
    artistName: string;
    approvedReferrals: number;
    rewardsEarned: number;
    badge?: 'top_referrer' | 'talent_scout' | 'community_builder';
}

// ============================================================================
// Referral Invitations
// ============================================================================

export interface ReferralInvitation {
    id: string;
    referralCode: string;
    recipientEmail: string;
    recipientName?: string;
    personalMessage?: string;
    sentAt: Date;
    openedAt?: Date;
    clickedAt?: Date;
    expiresAt: Date;
    status: 'sent' | 'opened' | 'clicked' | 'applied' | 'expired';
}

export interface ReferralEmailTemplate {
    subject: string;
    preheader: string;
    greeting: string;
    body: string;
    cta: string;
    footer: string;
}

// ============================================================================
// Referral Analytics
// ============================================================================

export interface ReferralFunnelMetrics {
    period: {
        startDate: Date;
        endDate: Date;
    };
    funnel: {
        invitationsSent: number;
        invitationsOpened: number;
        invitationsClicked: number;
        applicationsStarted: number;
        applicationsCompleted: number;
        applicationsApproved: number;
    };
    conversionRates: {
        openRate: number; // opened / sent
        clickRate: number; // clicked / opened
        applicationRate: number; // applied / clicked
        approvalRate: number; // approved / applied
        overallConversion: number; // approved / sent
    };
}

export interface ReferralCohortAnalysis {
    cohort: string; // e.g., "2026-Q1"
    referralsInCohort: number;
    approvalRate: number;
    averageTimeToApproval: number; // days
    averageFirstSaleTime: number; // days after approval
    retentionRate: number; // % still active after 6 months
}
