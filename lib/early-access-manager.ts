// Early Access Manager - Business Logic for VIP Early Access System

import {
    EarlyAccessDrop,
    AccessWindow,
    AccessEligibility,
    DropCountdown,
    TimeWindow,
    VIPNotification,
    VIPNotificationType,
} from '@/types/early-access';
import { MembershipTier, MEMBERSHIP_TIERS } from '@/types/membership';

// ============================================================================
// Access Eligibility
// ============================================================================

export function checkAccessEligibility(
    collectorTier: MembershipTier,
    subscriptionActive: boolean,
    drop: EarlyAccessDrop,
    currentTime: Date = new Date()
): AccessEligibility {
    if (!subscriptionActive) {
        return {
            collectorId: '', // Will be set by caller
            dropId: drop.id,
            tier: collectorTier,
            eligible: false,
            reason: 'Subscription not active',
        };
    }

    // Find the access window for this tier
    const accessWindow = drop.accessWindows.find(w => w.tier === collectorTier);

    if (!accessWindow) {
        return {
            collectorId: '',
            dropId: drop.id,
            tier: collectorTier,
            eligible: false,
            reason: 'No access window for this tier',
        };
    }

    // Check if current time is within access window
    const isWithinWindow = currentTime >= accessWindow.startAt && currentTime < accessWindow.endAt;

    if (!isWithinWindow) {
        const hasStarted = currentTime >= accessWindow.startAt;
        return {
            collectorId: '',
            dropId: drop.id,
            tier: collectorTier,
            eligible: false,
            accessStartAt: accessWindow.startAt,
            accessEndAt: accessWindow.endAt,
            reason: hasStarted ? 'Access window has ended' : 'Access window has not started',
        };
    }

    return {
        collectorId: '',
        dropId: drop.id,
        tier: collectorTier,
        eligible: true,
        accessStartAt: accessWindow.startAt,
        accessEndAt: accessWindow.endAt,
    };
}

// ============================================================================
// Early Access Drop Scheduling
// ============================================================================

export function scheduleEarlyDrop(
    artworkId: string,
    publicReleaseAt: Date,
    dropType: EarlyAccessDrop['dropType']
): EarlyAccessDrop {
    // Calculate access windows for each tier based on their early access hours
    const accessWindows: AccessWindow[] = [];

    const tiers: MembershipTier[] = ['platinum', 'gold', 'silver', 'bronze'];

    tiers.forEach(tier => {
        const tierDef = MEMBERSHIP_TIERS[tier];
        const earlyAccessMs = tierDef.earlyAccessHours * 60 * 60 * 1000;
        const startAt = new Date(publicReleaseAt.getTime() - earlyAccessMs);

        // End time is either the public release or the next tier's start time
        const nextTierIndex = tiers.indexOf(tier) + 1;
        let endAt: Date;

        if (nextTierIndex < tiers.length) {
            const nextTier = tiers[nextTierIndex];
            const nextTierDef = MEMBERSHIP_TIERS[nextTier];
            const nextTierEarlyAccessMs = nextTierDef.earlyAccessHours * 60 * 60 * 1000;
            endAt = new Date(publicReleaseAt.getTime() - nextTierEarlyAccessMs);
        } else {
            endAt = publicReleaseAt;
        }

        accessWindows.push({
            tier,
            startAt,
            endAt,
            eligibleCollectors: 0, // Will be populated from database
            viewCount: 0,
            purchaseCount: 0,
        });
    });

    return {
        id: generateUniqueId(),
        artworkId,
        title: '', // Will be populated from artwork data
        artistId: '',
        artistName: '',
        dropType,
        accessWindows,
        publicReleaseAt,
        createdAt: new Date(),
        status: 'scheduled',
    };
}

// ============================================================================
// VIP Notifications
// ============================================================================

export function sendVIPNotification(
    collectorId: string,
    drop: EarlyAccessDrop,
    notificationType: VIPNotificationType
): VIPNotification {
    const notification: VIPNotification = {
        id: generateUniqueId(),
        collectorId,
        dropId: drop.id,
        type: notificationType,
        title: '',
        message: '',
        actionUrl: `/artwork/${drop.artworkId}`,
        actionLabel: 'View Artwork',
        sentAt: new Date(),
    };

    switch (notificationType) {
        case 'early_access_alert':
            notification.title = '🌟 VIP Early Access Now Available';
            notification.message = `${drop.title} by ${drop.artistName} is now available for early access!`;
            break;

        case 'exclusive_drop_reminder':
            notification.title = '⏰ Early Access Ending Soon';
            notification.message = `Your early access to ${drop.title} ends in 24 hours. Don't miss out!`;
            break;

        case 'last_chance':
            notification.title = '🔥 Last Chance - Early Access Ending';
            notification.message = `Final hours to access ${drop.title} before public release!`;
            break;

        case 'sold_out_alert':
            notification.title = '✨ Limited Edition Sold Out';
            notification.message = `${drop.title} has sold out during early access. Thank you for your support!`;
            break;
    }

    return notification;
}

export function scheduleNotifications(drop: EarlyAccessDrop): VIPNotification[] {
    const notifications: VIPNotification[] = [];

    // For each tier, schedule notifications
    drop.accessWindows.forEach(window => {
        // 1. Early access start notification
        // (Would be sent to all eligible collectors at window.startAt)

        // 2. Reminder 24h before window ends
        const reminderTime = new Date(window.endAt.getTime() - 24 * 60 * 60 * 1000);
        if (reminderTime > window.startAt) {
            // Schedule reminder
        }

        // 3. Last chance notification 3h before window ends
        const lastChanceTime = new Date(window.endAt.getTime() - 3 * 60 * 60 * 1000);
        if (lastChanceTime > window.startAt) {
            // Schedule last chance
        }
    });

    return notifications;
}

// ============================================================================
// Countdown & Timers
// ============================================================================

export function calculateDropCountdown(
    drop: EarlyAccessDrop,
    collectorTier: MembershipTier,
    currentTime: Date = new Date()
): DropCountdown {
    const tierWindow = drop.accessWindows.find(w => w.tier === collectorTier);

    if (!tierWindow) {
        return {
            dropId: drop.id,
            collectorTier,
            accessStartsIn: 0,
            accessEndsIn: 0,
            publicReleaseIn: drop.publicReleaseAt.getTime() - currentTime.getTime(),
            status: 'upcoming',
        };
    }

    const accessStartsIn = tierWindow.startAt.getTime() - currentTime.getTime();
    const accessEndsIn = tierWindow.endAt.getTime() - currentTime.getTime();
    const publicReleaseIn = drop.publicReleaseAt.getTime() - currentTime.getTime();

    let status: DropCountdown['status'];
    if (accessStartsIn > 0) {
        status = 'upcoming';
    } else if (accessEndsIn > 0) {
        // Check if ending soon (less than 3 hours)
        if (accessEndsIn < 3 * 60 * 60 * 1000) {
            status = 'ending_soon';
        } else {
            status = 'active';
        }
    } else {
        status = 'ended';
    }

    return {
        dropId: drop.id,
        collectorTier,
        accessStartsIn: Math.max(0, accessStartsIn),
        accessEndsIn: Math.max(0, accessEndsIn),
        publicReleaseIn: Math.max(0, publicReleaseIn),
        status,
    };
}

export function getTimeWindows(
    drop: EarlyAccessDrop,
    collectorTier: MembershipTier,
    currentTime: Date = new Date()
): TimeWindow[] {
    const windows: TimeWindow[] = [];

    const tierWindow = drop.accessWindows.find(w => w.tier === collectorTier);

    if (tierWindow) {
        const isActive = currentTime >= tierWindow.startAt && currentTime < tierWindow.endAt;
        const isUpcoming = currentTime < tierWindow.startAt;
        const isEnded = currentTime >= tierWindow.endAt;

        windows.push({
            label: `${MEMBERSHIP_TIERS[collectorTier].name} Early Access`,
            startAt: tierWindow.startAt,
            endAt: tierWindow.endAt,
            active: isActive,
            upcoming: isUpcoming,
            ended: isEnded,
        });
    }

    // Public release window
    const publicActive = currentTime >= drop.publicReleaseAt;
    const publicUpcoming = currentTime < drop.publicReleaseAt;

    windows.push({
        label: 'Public Release',
        startAt: drop.publicReleaseAt,
        endAt: new Date(drop.publicReleaseAt.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year
        active: publicActive,
        upcoming: publicUpcoming,
        ended: false,
    });

    return windows;
}

// ============================================================================
// Early Access Metrics
// ============================================================================

export function trackEarlyAccessMetrics(drop: EarlyAccessDrop): {
    totalViews: number;
    totalPurchases: number;
    earlyAccessConversion: number;
    tierPerformance: Record<MembershipTier, { views: number; purchases: number; conversion: number }>;
} {
    let totalViews = 0;
    let totalPurchases = 0;

    const tierPerformance: Record<MembershipTier, { views: number; purchases: number; conversion: number }> = {
        bronze: { views: 0, purchases: 0, conversion: 0 },
        silver: { views: 0, purchases: 0, conversion: 0 },
        gold: { views: 0, purchases: 0, conversion: 0 },
        platinum: { views: 0, purchases: 0, conversion: 0 },
    };

    drop.accessWindows.forEach(window => {
        totalViews += window.viewCount;
        totalPurchases += window.purchaseCount;

        tierPerformance[window.tier] = {
            views: window.viewCount,
            purchases: window.purchaseCount,
            conversion: window.viewCount > 0 ? (window.purchaseCount / window.viewCount) * 100 : 0,
        };
    });

    const earlyAccessConversion = totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0;

    return {
        totalViews,
        totalPurchases,
        earlyAccessConversion,
        tierPerformance,
    };
}

// ============================================================================
// Utility Functions
// ============================================================================

function generateUniqueId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatTimeRemaining(milliseconds: number): string {
    if (milliseconds <= 0) {
        return 'Ended';
    }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

export function isDropActive(drop: EarlyAccessDrop, currentTime: Date = new Date()): boolean {
    return drop.status === 'active' && currentTime < drop.publicReleaseAt;
}

export function getActiveAccessWindow(
    drop: EarlyAccessDrop,
    currentTime: Date = new Date()
): AccessWindow | null {
    return drop.accessWindows.find(
        w => currentTime >= w.startAt && currentTime < w.endAt
    ) || null;
}
