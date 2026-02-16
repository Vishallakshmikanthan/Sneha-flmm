'use client';

import { useEffect } from 'react';
import { useRecommendationStore } from '@/lib/store/recommendationStore';
import { useInitializeTracking, useTrackPageView } from '@/hooks/useEventTracking';

// ============================================================================
// Tracking Provider - Initialize event tracking for the app
// ============================================================================

export function TrackingProvider({ children }: { children: React.ReactNode }) {
    const initializeSession = useRecommendationStore((state) => state.initializeSession);

    // Initialize session on mount
    useEffect(() => {
        initializeSession();
    }, [initializeSession]);

    // Initialize event tracker
    useInitializeTracking();

    // Track page views
    useTrackPageView();

    return <>{children}</>;
}
