// Referral Manager - Business Logic for Artist Referral Program

import {
    ArtistReferral,
    ReferralStatus,
    ReferralReward,
    ReferralRewardType,
    ReferralMetrics,
    REFERRAL_REWARD_STRUCTURE,
} from '@/types/referral';

// ============================================================================
// Referral Code Generation
// ============================================================================

export function generateReferralCode(artistId: string, artistName: string): string {
    // Create a unique, memorable referral code
    // Format: ARTIST-INITIALS-RANDOM (e.g., "VG-A3X9")

    const initials = artistName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);

    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `${initials}-${random}`;
}

export function validateReferralCode(code: string): boolean {
    // Validate format: 2-3 letters, hyphen, 4 alphanumeric
    const regex = /^[A-Z]{2,3}-[A-Z0-9]{4}$/;
    return regex.test(code);
}

// ============================================================================
// Referral Tracking
// ============================================================================

export function trackReferral(
    referrerId: string,
    referredEmail: string,
    referralCode: string
): ArtistReferral {
    return {
        id: generateUniqueId(),
        referrerId,
        referrerName: '', // Will be populated from database
        referralCode,
        referredEmail,
        status: 'pending',
        createdAt: new Date(),
    };
}

export function updateReferralStatus(
    referral: ArtistReferral,
    newStatus: ReferralStatus,
    applicationId?: string,
    artistId?: string
): ArtistReferral {
    const updated: ArtistReferral = {
        ...referral,
        status: newStatus,
    };

    if (newStatus === 'applied' && applicationId) {
        updated.applicationId = applicationId;
    }

    if (newStatus === 'approved') {
        updated.convertedAt = new Date();
        if (artistId) {
            updated.artistId = artistId;
        }
    }

    return updated;
}

// ============================================================================
// Reward Calculation
// ============================================================================

export function calculateReward(
    referral: ArtistReferral,
    rewardType: ReferralRewardType
): ReferralReward {
    const rewardStructure = REFERRAL_REWARD_STRUCTURE[rewardType];

    return {
        id: generateUniqueId(),
        referralId: referral.id,
        referrerId: referral.referrerId,
        rewardType,
        rewardValue: rewardStructure.value,
        status: 'pending',
        description: rewardStructure.description,
    };
}

export function checkRewardEligibility(
    referral: ArtistReferral,
    rewardType: ReferralRewardType,
    referredArtistSales: number = 0,
    totalApprovedReferrals: number = 0
): boolean {
    const structure = REFERRAL_REWARD_STRUCTURE[rewardType];

    switch (rewardType) {
        case 'commission_bonus':
            // Eligible when referred artist makes first sale
            return referral.status === 'approved' && referredArtistSales >= 1;

        case 'cash_bonus':
            // Eligible when referred artist completes 5 sales
            return referral.status === 'approved' && referredArtistSales >= 5;

        case 'featured_placement':
            // Eligible immediately upon approval
            return referral.status === 'approved';

        case 'tier_upgrade':
            // Eligible when referrer has 3+ approved referrals
            return totalApprovedReferrals >= 3;

        default:
            return false;
    }
}

// ============================================================================
// Referral Metrics
// ============================================================================

export function calculateReferralMetrics(
    artistId: string,
    referrals: ArtistReferral[],
    rewards: ReferralReward[],
    startDate: Date,
    endDate: Date
): ReferralMetrics {
    const periodReferrals = referrals.filter(
        r => r.referrerId === artistId &&
            r.createdAt >= startDate &&
            r.createdAt <= endDate
    );

    const totalReferrals = periodReferrals.length;
    const pendingReferrals = periodReferrals.filter(r => r.status === 'pending').length;
    const appliedReferrals = periodReferrals.filter(r => r.status === 'applied').length;
    const approvedReferrals = periodReferrals.filter(r => r.status === 'approved').length;
    const rejectedReferrals = periodReferrals.filter(r => r.status === 'rejected').length;

    const conversionRate = totalReferrals > 0
        ? (approvedReferrals / totalReferrals) * 100
        : 0;

    const artistRewards = rewards.filter(r => r.referrerId === artistId);
    const totalRewardsEarned = artistRewards
        .filter(r => r.status === 'earned' || r.status === 'paid')
        .reduce((sum, r) => sum + r.rewardValue, 0);
    const rewardsPaid = artistRewards
        .filter(r => r.status === 'paid')
        .reduce((sum, r) => sum + r.rewardValue, 0);
    const rewardsPending = artistRewards
        .filter(r => r.status === 'pending' || r.status === 'earned')
        .reduce((sum, r) => sum + r.rewardValue, 0);

    return {
        artistId,
        period: { startDate, endDate },
        totalReferrals,
        pendingReferrals,
        appliedReferrals,
        approvedReferrals,
        rejectedReferrals,
        conversionRate,
        totalRewardsEarned,
        rewardsPaid,
        rewardsPending,
    };
}

// ============================================================================
// Referral Invitation
// ============================================================================

export function createReferralInvitation(
    referralCode: string,
    recipientEmail: string,
    recipientName?: string,
    personalMessage?: string
): {
    invitationUrl: string;
    emailSubject: string;
    emailBody: string;
} {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://starrynight.art';
    const invitationUrl = `${baseUrl}/artist/apply?ref=${referralCode}`;

    const emailSubject = `You're invited to join Starry Night Premium Art Marketplace`;

    const emailBody = `
Hi ${recipientName || 'there'},

${personalMessage || 'I think you\'d be a great fit for Starry Night, a premium curated art marketplace.'}

Starry Night is an exclusive platform for exceptional artists. We offer:
- Fair commission rates (20-25% vs industry 40-50%)
- Premium collector audience
- AI-powered personalized recommendations
- Immersive 3D gallery experience
- Transparent analytics and support

I'd love for you to join our community. Use my referral link to apply:
${invitationUrl}

Looking forward to seeing your work on the platform!

Best regards
    `.trim();

    return {
        invitationUrl,
        emailSubject,
        emailBody,
    };
}

// ============================================================================
// Leaderboard & Rankings
// ============================================================================

export function calculateReferrerRank(
    artistId: string,
    allReferrals: ArtistReferral[],
    allRewards: ReferralReward[]
): {
    rank: number;
    approvedReferrals: number;
    rewardsEarned: number;
    badge?: 'top_referrer' | 'talent_scout' | 'community_builder';
} {
    // Group referrals by referrer
    const referrerStats = new Map<string, { approved: number; rewards: number }>();

    allReferrals.forEach(referral => {
        if (!referrerStats.has(referral.referrerId)) {
            referrerStats.set(referral.referrerId, { approved: 0, rewards: 0 });
        }

        const stats = referrerStats.get(referral.referrerId)!;
        if (referral.status === 'approved') {
            stats.approved++;
        }
    });

    allRewards.forEach(reward => {
        if (referrerStats.has(reward.referrerId)) {
            const stats = referrerStats.get(reward.referrerId)!;
            if (reward.status === 'earned' || reward.status === 'paid') {
                stats.rewards += reward.rewardValue;
            }
        }
    });

    // Sort by approved referrals, then by rewards
    const sortedReferrers = Array.from(referrerStats.entries())
        .sort((a, b) => {
            if (b[1].approved !== a[1].approved) {
                return b[1].approved - a[1].approved;
            }
            return b[1].rewards - a[1].rewards;
        });

    const rank = sortedReferrers.findIndex(([id]) => id === artistId) + 1;
    const stats = referrerStats.get(artistId) || { approved: 0, rewards: 0 };

    // Assign badges
    let badge: 'top_referrer' | 'talent_scout' | 'community_builder' | undefined;
    if (rank === 1) {
        badge = 'top_referrer';
    } else if (stats.approved >= 10) {
        badge = 'talent_scout';
    } else if (stats.approved >= 5) {
        badge = 'community_builder';
    }

    return {
        rank,
        approvedReferrals: stats.approved,
        rewardsEarned: stats.rewards,
        badge,
    };
}

// ============================================================================
// Utility Functions
// ============================================================================

function generateUniqueId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function isReferralExpired(referral: ArtistReferral): boolean {
    const expirationDays = 90;
    const expirationMs = expirationDays * 24 * 60 * 60 * 1000;
    const expirationDate = new Date(referral.createdAt.getTime() + expirationMs);

    return new Date() > expirationDate && referral.status === 'pending';
}

export function getReferralShareLinks(referralCode: string): {
    email: string;
    twitter: string;
    linkedin: string;
    facebook: string;
} {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://starrynight.art';
    const invitationUrl = `${baseUrl}/artist/apply?ref=${referralCode}`;
    const message = encodeURIComponent('Join me on Starry Night, a premium art marketplace!');

    return {
        email: `mailto:?subject=${message}&body=${encodeURIComponent(invitationUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(invitationUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(invitationUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(invitationUrl)}`,
    };
}
