// Early Access & Exclusive Drops Type Definitions

// ============================================================================
// Early Access System
// ============================================================================

export interface EarlyAccessDrop {
    id: string;
    artworkId: string;
    title: string;
    artistId: string;
    artistName: string;
    dropType: DropType;
    accessWindows: AccessWindow[];
    publicReleaseAt: Date;
    createdAt: Date;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export type DropType =
    | 'limited_edition' // Limited edition artwork
    | 'exclusive_collection' // Curated collection
    | 'artist_premiere' // New artist debut
    | 'seasonal_drop'; // Seasonal exclusive

export interface AccessWindow {
    tier: MembershipTier;
    startAt: Date;
    endAt: Date;
    notificationSentAt?: Date;
    eligibleCollectors: number;
    viewCount: number;
    purchaseCount: number;
}

// ============================================================================
// VIP Notifications
// ============================================================================

export interface VIPNotification {
    id: string;
    collectorId: string;
    dropId: string;
    type: VIPNotificationType;
    title: string;
    message: string;
    imageUrl?: string;
    actionUrl: string;
    actionLabel: string;
    sentAt: Date;
    readAt?: Date;
    clickedAt?: Date;
    convertedAt?: Date; // If resulted in purchase
}

export type VIPNotificationType =
    | 'early_access_alert' // New early access drop available
    | 'exclusive_drop_reminder' // Reminder before window closes
    | 'last_chance' // Final hours of early access
    | 'sold_out_alert'; // Limited edition sold out

// ============================================================================
// Access Eligibility
// ============================================================================

export interface AccessEligibility {
    collectorId: string;
    dropId: string;
    tier: MembershipTier;
    eligible: boolean;
    accessStartAt?: Date;
    accessEndAt?: Date;
    reason?: string; // If not eligible, why
}

export interface EligibilityCheck {
    collectorId: string;
    membershipTier: MembershipTier;
    subscriptionActive: boolean;
    earlyAccessHours: number;
    eligibleDrops: string[]; // Drop IDs
}

// ============================================================================
// Drop Performance Metrics
// ============================================================================

export interface DropPerformance {
    dropId: string;
    artworkId: string;
    title: string;
    dropType: DropType;
    metrics: {
        totalEligibleCollectors: number;
        notificationsSent: number;
        notificationOpenRate: number;
        notificationClickRate: number;
        earlyAccessViews: number;
        earlyAccessPurchases: number;
        publicViews: number;
        publicPurchases: number;
        totalRevenue: number;
        earlyAccessRevenue: number;
        conversionRate: number;
    };
    tierBreakdown: TierPerformance[];
}

export interface TierPerformance {
    tier: MembershipTier;
    eligibleCollectors: number;
    views: number;
    purchases: number;
    revenue: number;
    conversionRate: number;
}

// ============================================================================
// Exclusive Drop Calendar
// ============================================================================

export interface DropCalendar {
    month: string; // YYYY-MM
    drops: ScheduledDrop[];
    totalDrops: number;
    dropsByType: Record<DropType, number>;
}

export interface ScheduledDrop {
    id: string;
    artworkId: string;
    title: string;
    artistName: string;
    dropType: DropType;
    platinumAccessAt: Date;
    goldAccessAt: Date;
    silverAccessAt: Date;
    bronzeAccessAt: Date;
    publicReleaseAt: Date;
    imageUrl: string;
    estimatedPrice: number;
    limitedEdition: boolean;
    editionSize?: number;
}

// ============================================================================
// Early Access Analytics
// ============================================================================

export interface EarlyAccessAnalytics {
    period: {
        startDate: Date;
        endDate: Date;
    };
    overview: {
        totalDrops: number;
        totalEarlyAccessRevenue: number;
        averageConversionRate: number;
        topPerformingTier: MembershipTier;
    };
    tierEngagement: Record<MembershipTier, {
        eligibleCollectors: number;
        activeCollectors: number;
        engagementRate: number;
        averagePurchaseValue: number;
        totalRevenue: number;
    }>;
    dropTypePerformance: Record<DropType, {
        count: number;
        averageRevenue: number;
        averageConversion: number;
    }>;
}

// ============================================================================
// Countdown & Timers
// ============================================================================

export interface DropCountdown {
    dropId: string;
    collectorTier: MembershipTier;
    accessStartsIn: number; // milliseconds
    accessEndsIn: number; // milliseconds
    publicReleaseIn: number; // milliseconds
    status: 'upcoming' | 'active' | 'ending_soon' | 'ended';
}

export interface TimeWindow {
    label: string; // "VIP Early Access" or "Public Release"
    startAt: Date;
    endAt: Date;
    active: boolean;
    upcoming: boolean;
    ended: boolean;
}

// Import membership tier type
import { MembershipTier } from './membership';
