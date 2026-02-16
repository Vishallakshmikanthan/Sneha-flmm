import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useRecommendationStore } from '@/lib/store/recommendationStore';
import { getEventTracker, initializeEventTracker } from '@/lib/tracking/event-tracker';
import type { ArtworkClickEvent } from '@/types/recommendation';

// ============================================================================
// useInitializeTracking - Initialize event tracker on app mount
// ============================================================================

export function useInitializeTracking() {
    const sessionId = useRecommendationStore((state) => state.sessionId);
    const userId = useRecommendationStore((state) => state.userId);
    const isTrackingEnabled = useRecommendationStore((state) => state.isTrackingEnabled());

    useEffect(() => {
        const tracker = initializeEventTracker(sessionId, userId);
        tracker.setEnabled(isTrackingEnabled);
    }, [sessionId, userId, isTrackingEnabled]);
}

// ============================================================================
// useTrackPageView - Auto-track page views
// ============================================================================

export function useTrackPageView() {
    const pathname = usePathname();
    const isTrackingEnabled = useRecommendationStore((state) => state.isTrackingEnabled());
    const previousPathname = useRef<string | null>(null);

    useEffect(() => {
        if (!isTrackingEnabled) return;

        // Only track if pathname actually changed
        if (pathname === previousPathname.current) return;

        try {
            const tracker = getEventTracker();
            const referrer = previousPathname.current || document.referrer;

            tracker.trackPageView(pathname, referrer);
            previousPathname.current = pathname;
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    }, [pathname, isTrackingEnabled]);
}

// ============================================================================
// useTrackArtworkInteraction - Track artwork clicks and hovers
// ============================================================================

interface UseTrackArtworkInteractionOptions {
    artworkId: string;
    artworkTitle: string;
    category: string;
    price: number;
    position: number;
    context: ArtworkClickEvent['context'];
}

export function useTrackArtworkInteraction(options: UseTrackArtworkInteractionOptions) {
    const isTrackingEnabled = useRecommendationStore((state) => state.isTrackingEnabled());
    const hoverStartTime = useRef<number | null>(null);

    const trackClick = useCallback(() => {
        if (!isTrackingEnabled) return;

        try {
            const tracker = getEventTracker();
            tracker.trackArtworkClick(
                options.artworkId,
                options.artworkTitle,
                options.category,
                options.price,
                options.position,
                options.context
            );
        } catch (error) {
            console.error('Failed to track artwork click:', error);
        }
    }, [isTrackingEnabled, options]);

    const trackHoverStart = useCallback(() => {
        hoverStartTime.current = Date.now();
    }, []);

    const trackHoverEnd = useCallback(() => {
        if (!isTrackingEnabled || !hoverStartTime.current) return;

        try {
            const duration = Date.now() - hoverStartTime.current;

            // Only track hovers longer than 500ms (intentional hovers)
            if (duration > 500) {
                const tracker = getEventTracker();
                tracker.trackArtworkHover(options.artworkId, duration);
            }

            hoverStartTime.current = null;
        } catch (error) {
            console.error('Failed to track artwork hover:', error);
        }
    }, [isTrackingEnabled, options.artworkId]);

    return {
        trackClick,
        trackHoverStart,
        trackHoverEnd,
    };
}

// ============================================================================
// useTrackScrollDepth - Track scroll depth on a page
// ============================================================================

export function useTrackScrollDepth() {
    const pathname = usePathname();
    const isTrackingEnabled = useRecommendationStore((state) => state.isTrackingEnabled());
    const maxDepth = useRef(0);
    const lastReportedDepth = useRef(0);

    useEffect(() => {
        if (!isTrackingEnabled) return;

        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;

            const currentDepth = Math.round(
                ((scrollTop + windowHeight) / documentHeight) * 100
            );

            // Update max depth
            if (currentDepth > maxDepth.current) {
                maxDepth.current = currentDepth;
            }

            // Report every 25% milestone
            const milestones = [25, 50, 75, 100];
            for (const milestone of milestones) {
                if (
                    currentDepth >= milestone &&
                    lastReportedDepth.current < milestone
                ) {
                    try {
                        const tracker = getEventTracker();
                        tracker.trackScrollDepth(pathname, currentDepth, maxDepth.current);
                        lastReportedDepth.current = milestone;
                    } catch (error) {
                        console.error('Failed to track scroll depth:', error);
                    }
                    break;
                }
            }
        };

        // Throttle scroll events
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            // Reset for next page
            maxDepth.current = 0;
            lastReportedDepth.current = 0;
        };
    }, [pathname, isTrackingEnabled]);
}

// ============================================================================
// useTrackCartEvents - Track cart interactions
// ============================================================================

export function useTrackCartEvents() {
    const isTrackingEnabled = useRecommendationStore((state) => state.isTrackingEnabled());

    const trackAddToCart = useCallback(
        (artworkId: string, price: number, quantity: number = 1) => {
            if (!isTrackingEnabled) return;

            try {
                const tracker = getEventTracker();
                tracker.trackAddToCart(artworkId, price, quantity);
            } catch (error) {
                console.error('Failed to track add to cart:', error);
            }
        },
        [isTrackingEnabled]
    );

    const trackRemoveFromCart = useCallback(
        (artworkId: string, price: number, quantity: number = 1) => {
            if (!isTrackingEnabled) return;

            try {
                const tracker = getEventTracker();
                tracker.trackRemoveFromCart(artworkId, price, quantity);
            } catch (error) {
                console.error('Failed to track remove from cart:', error);
            }
        },
        [isTrackingEnabled]
    );

    const trackPurchase = useCallback(
        (
            orderId: string,
            artworkIds: string[],
            totalAmount: number,
            itemCount: number
        ) => {
            if (!isTrackingEnabled) return;

            try {
                const tracker = getEventTracker();
                tracker.trackPurchase(orderId, artworkIds, totalAmount, itemCount);
            } catch (error) {
                console.error('Failed to track purchase:', error);
            }
        },
        [isTrackingEnabled]
    );

    return {
        trackAddToCart,
        trackRemoveFromCart,
        trackPurchase,
    };
}

// ============================================================================
// useTrackSearch - Track search queries
// ============================================================================

export function useTrackSearch() {
    const isTrackingEnabled = useRecommendationStore((state) => state.isTrackingEnabled());

    const trackSearch = useCallback(
        (query: string, resultsCount: number) => {
            if (!isTrackingEnabled) return;

            try {
                const tracker = getEventTracker();
                tracker.trackSearch(query, resultsCount);
            } catch (error) {
                console.error('Failed to track search:', error);
            }
        },
        [isTrackingEnabled]
    );

    return { trackSearch };
}

// ============================================================================
// useTrackCategoryView - Track category browsing
// ============================================================================

export function useTrackCategoryView(categoryId: string, categoryName: string) {
    const isTrackingEnabled = useRecommendationStore((state) => state.isTrackingEnabled());

    useEffect(() => {
        if (!isTrackingEnabled) return;

        try {
            const tracker = getEventTracker();
            tracker.trackCategoryView(categoryId, categoryName);
        } catch (error) {
            console.error('Failed to track category view:', error);
        }
    }, [categoryId, categoryName, isTrackingEnabled]);
}

// ============================================================================
// useTrackArtistView - Track artist page views
// ============================================================================

export function useTrackArtistView(artistId: string, artistName: string) {
    const isTrackingEnabled = useRecommendationStore((state) => state.isTrackingEnabled());

    useEffect(() => {
        if (!isTrackingEnabled) return;

        try {
            const tracker = getEventTracker();
            tracker.trackArtistView(artistId, artistName);
        } catch (error) {
            console.error('Failed to track artist view:', error);
        }
    }, [artistId, artistName, isTrackingEnabled]);
}
