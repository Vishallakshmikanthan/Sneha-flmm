import {
    AnalyticsMetrics,
    AudienceDemographics,
    ArtworkPerformance
} from '@/types/artist-ecosystem';

/**
 * Track artwork view event
 */
export async function trackArtworkView(
    artworkId: string,
    userId?: string,
    metadata?: {
        referrer?: string;
        device?: 'desktop' | 'mobile' | 'tablet';
        country?: string;
    }
): Promise<void> {
    // In a real implementation, this would send data to an analytics service
    // For now, we'll use localStorage for demo purposes

    const event: StoredEvent = {
        type: 'view',
        artworkId,
        userId,
        timestamp: new Date().toISOString(),
        metadata,
    };

    // Store in localStorage (replace with actual analytics service)
    const events = getStoredEvents();
    events.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(events));
}

/**
 * Track artwork click event
 */
export async function trackArtworkClick(
    artworkId: string,
    userId?: string,
    source?: string
): Promise<void> {
    const event: StoredEvent = {
        type: 'click',
        artworkId,
        userId,
        source,
        timestamp: new Date().toISOString(),
    };

    const events = getStoredEvents();
    events.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(events));
}

/**
 * Track artwork conversion (purchase)
 */
export async function trackArtworkConversion(
    artworkId: string,
    userId: string,
    amount: number
): Promise<void> {
    const event: StoredEvent = {
        type: 'conversion',
        artworkId,
        userId,
        amount,
        timestamp: new Date().toISOString(),
    };

    const events = getStoredEvents();
    events.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(events));
}

interface StoredEvent {
    type: 'view' | 'click' | 'conversion';
    artworkId: string;
    userId?: string;
    timestamp: string;
    metadata?: {
        referrer?: string;
        device?: string;
        country?: string;
    };
    source?: string;
    amount?: number;
}

/**
 * Get stored analytics events
 */
function getStoredEvents(): StoredEvent[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem('analytics_events');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Calculate metrics for an artist
 */
export function calculateArtistMetrics(
    artistId: string,
    artworkIds: string[],
    startDate: Date,
    endDate: Date
): AnalyticsMetrics {
    const events = getStoredEvents();

    // Filter events for this artist's artworks within date range
    const artistEvents = events.filter((event: StoredEvent) => {
        const eventDate = new Date(event.timestamp);
        return (
            artworkIds.includes(event.artworkId) &&
            eventDate >= startDate &&
            eventDate <= endDate
        );
    });

    // Calculate views
    const viewEvents = artistEvents.filter((e: StoredEvent) => e.type === 'view');
    const uniqueViewers = new Set(viewEvents.map((e: StoredEvent) => e.userId || 'anonymous'));

    // Calculate clicks
    const clickEvents = artistEvents.filter((e: StoredEvent) => e.type === 'click');

    // Calculate conversions
    const conversionEvents = artistEvents.filter((e: StoredEvent) => e.type === 'conversion');

    // Calculate revenue
    const totalRevenue = conversionEvents.reduce(
        (sum: number, e: StoredEvent) => sum + (e.amount || 0),
        0
    );
    const averageSalePrice = conversionEvents.length > 0
        ? totalRevenue / conversionEvents.length
        : 0;

    // Generate trend data (daily aggregation)
    const viewTrend = generateTrendData(viewEvents, startDate, endDate);
    const revenueTrend = generateTrendData(conversionEvents, startDate, endDate, 'amount');

    return {
        views: {
            total: viewEvents.length,
            unique: uniqueViewers.size,
            trend: viewTrend,
        },
        clickThroughRate: {
            rate: viewEvents.length > 0 ? (clickEvents.length / viewEvents.length) * 100 : 0,
            clicks: clickEvents.length,
            impressions: viewEvents.length,
        },
        conversionRate: {
            rate: clickEvents.length > 0 ? (conversionEvents.length / clickEvents.length) * 100 : 0,
            conversions: conversionEvents.length,
            visitors: uniqueViewers.size,
        },
        revenue: {
            total: totalRevenue,
            averageSalePrice,
            trend: revenueTrend,
        },
    };
}

/**
 * Generate trend data from events
 */
function generateTrendData(
    events: StoredEvent[],
    startDate: Date,
    endDate: Date,
    valueKey?: keyof StoredEvent
): { date: Date; value: number }[] {
    const trendMap = new Map<string, number>();

    // Initialize all dates in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        trendMap.set(dateKey, 0);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Aggregate events by date
    events.forEach((event: StoredEvent) => {
        const dateKey = new Date(event.timestamp).toISOString().split('T')[0];
        const currentValue = trendMap.get(dateKey) || 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventValue = valueKey ? ((event[valueKey] as any) || 1) : 1;
        trendMap.set(dateKey, currentValue + eventValue);
    });

    // Convert to array
    return Array.from(trendMap.entries()).map(([dateStr, value]) => ({
        date: new Date(dateStr),
        value,
    }));
}

/**
 * Calculate audience demographics
 */
export function calculateAudienceDemographics(
    artistId: string,
    artworkIds: string[],
    startDate: Date,
    endDate: Date
): AudienceDemographics {
    const events = getStoredEvents();

    const artistEvents = events.filter((event: StoredEvent) => {
        const eventDate = new Date(event.timestamp);
        return (
            artworkIds.includes(event.artworkId) &&
            eventDate >= startDate &&
            eventDate <= endDate &&
            event.type === 'view'
        );
    });

    // Geographic data
    const countryMap = new Map<string, number>();
    artistEvents.forEach((event: StoredEvent) => {
        const country = event.metadata?.country || 'Unknown';
        countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });

    const totalViews = artistEvents.length;
    const geographic = Array.from(countryMap.entries()).map(([country, count]) => ({
        country,
        countryCode: country.substring(0, 2).toUpperCase(),
        visitors: count,
        percentage: (count / totalViews) * 100,
    }));

    // Device data
    const deviceMap = new Map<string, number>();
    artistEvents.forEach((event: StoredEvent) => {
        const device = (event.metadata?.device as string) || 'desktop';
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    const devices = Array.from(deviceMap.entries()).map(([deviceType, count]) => ({
        deviceType: deviceType as 'desktop' | 'mobile' | 'tablet',
        visitors: count,
        percentage: (count / totalViews) * 100,
    }));

    // Time of day data
    const hourMap = new Map<number, number>();
    for (let i = 0; i < 24; i++) {
        hourMap.set(i, 0);
    }

    artistEvents.forEach((event: StoredEvent) => {
        const hour = new Date(event.timestamp).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

    const timeOfDay = Array.from(hourMap.entries()).map(([hour, visitors]) => ({
        hour,
        visitors,
    }));

    // Referral sources
    const referralMap = new Map<string, number>();
    artistEvents.forEach((event: StoredEvent) => {
        const source = (event.metadata?.referrer as string) || 'Direct';
        referralMap.set(source, (referralMap.get(source) || 0) + 1);
    });

    const referralSources = Array.from(referralMap.entries()).map(([source, count]) => ({
        source,
        visitors: count,
        percentage: (count / totalViews) * 100,
    }));

    return {
        geographic,
        devices,
        timeOfDay,
        referralSources,
    };
}

/**
 * Calculate artwork performance
 */
export function calculateArtworkPerformance(
    artworkIds: string[],
    startDate: Date,
    endDate: Date
): ArtworkPerformance[] {
    const events = getStoredEvents();

    return artworkIds.map((artworkId) => {
        const artworkEvents = events.filter((event: StoredEvent) => {
            const eventDate = new Date(event.timestamp);
            return (
                event.artworkId === artworkId &&
                eventDate >= startDate &&
                eventDate <= endDate
            );
        });

        const views = artworkEvents.filter((e: StoredEvent) => e.type === 'view').length;
        const clicks = artworkEvents.filter((e: StoredEvent) => e.type === 'click').length;
        const conversions = artworkEvents.filter((e: StoredEvent) => e.type === 'conversion').length;
        const revenue = artworkEvents
            .filter((e: StoredEvent) => e.type === 'conversion')
            .reduce((sum: number, e: StoredEvent) => sum + (e.amount || 0), 0);

        const ctr = views > 0 ? (clicks / views) * 100 : 0;
        const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

        return {
            artworkId,
            title: '', // Would be fetched from artwork data
            views,
            clicks,
            conversions,
            revenue,
            ctr,
            conversionRate,
        };
    });
}
