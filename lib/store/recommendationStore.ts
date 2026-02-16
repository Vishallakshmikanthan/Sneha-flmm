import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    UserEvent,
    UserPreferences,
    RecommendationCache,
    PrivacySettings,
} from '@/types/recommendation';

// ============================================================================
// Recommendation Store State
// ============================================================================

interface RecommendationStore {
    // User interaction history (client-side cache)
    events: UserEvent[];
    sessionId: string;
    userId?: string;

    // User preferences
    preferences: UserPreferences | null;

    // Recommendation cache
    recommendationCache: RecommendationCache | null;

    // Privacy settings
    privacySettings: PrivacySettings;

    // Actions - Event Tracking
    trackEvent: (event: UserEvent) => void;
    clearEvents: () => void;
    getEventsByType: (eventType: string) => UserEvent[];

    // Actions - Preferences
    setPreferences: (preferences: UserPreferences) => void;
    updateCategoryAffinity: (category: string, score: number) => void;
    updatePriceRange: (min: number, max: number) => void;

    // Actions - Recommendation Cache
    setRecommendationCache: (cache: RecommendationCache) => void;
    clearRecommendationCache: () => void;
    isCacheValid: () => boolean;

    // Actions - Privacy
    setPrivacySettings: (settings: Partial<PrivacySettings>) => void;
    isTrackingEnabled: () => boolean;
    isPersonalizationEnabled: () => boolean;

    // Utilities
    initializeSession: () => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getDefaultPrivacySettings = (sessionId: string): PrivacySettings => ({
    sessionId,
    personalizationEnabled: true, // Default to enabled, user can opt-out
    trackingEnabled: true,
    analyticsEnabled: true,
});

const getDefaultPreferences = (sessionId: string): UserPreferences => ({
    sessionId,
    categoryAffinity: {},
    priceRange: {
        min: 0,
        max: 500000,
        average: 150000,
    },
    colorPreferences: [],
    styleAffinity: {},
    eraAffinity: {},
    favoriteArtists: [],
    purchaseFrequency: 0,
    averageSessionDuration: 0,
    totalSpent: 0,
    firstSeen: Date.now(),
    lastSeen: Date.now(),
    updatedAt: Date.now(),
});

// ============================================================================
// Zustand Store
// ============================================================================

export const useRecommendationStore = create<RecommendationStore>()(
    persist(
        (set, get) => ({
            // Initial state
            events: [],
            sessionId: generateSessionId(),
            userId: undefined,
            preferences: null,
            recommendationCache: null,
            privacySettings: getDefaultPrivacySettings(generateSessionId()),

            // Initialize session
            initializeSession: () => {
                const sessionId = generateSessionId();
                set({
                    sessionId,
                    events: [],
                    privacySettings: getDefaultPrivacySettings(sessionId),
                    preferences: getDefaultPreferences(sessionId),
                });
            },

            // Event tracking
            trackEvent: (event) => {
                const { privacySettings, events } = get();

                // Respect privacy settings
                if (!privacySettings.trackingEnabled) {
                    return;
                }

                // Add event to history
                const updatedEvents = [...events, event];

                // Keep only last 100 events to avoid memory issues
                const trimmedEvents = updatedEvents.slice(-100);

                set({ events: trimmedEvents });
            },

            clearEvents: () => {
                set({ events: [] });
            },

            getEventsByType: (eventType) => {
                return get().events.filter((e) => e.eventType === eventType);
            },

            // Preferences management
            setPreferences: (preferences) => {
                set({ preferences });
            },

            updateCategoryAffinity: (category, score) => {
                const { preferences } = get();
                if (!preferences) return;

                set({
                    preferences: {
                        ...preferences,
                        categoryAffinity: {
                            ...preferences.categoryAffinity,
                            [category]: score,
                        },
                        updatedAt: Date.now(),
                    },
                });
            },

            updatePriceRange: (min, max) => {
                const { preferences } = get();
                if (!preferences) return;

                set({
                    preferences: {
                        ...preferences,
                        priceRange: {
                            min,
                            max,
                            average: (min + max) / 2,
                        },
                        updatedAt: Date.now(),
                    },
                });
            },

            // Recommendation cache
            setRecommendationCache: (cache) => {
                set({ recommendationCache: cache });
            },

            clearRecommendationCache: () => {
                set({ recommendationCache: null });
            },

            isCacheValid: () => {
                const { recommendationCache } = get();
                if (!recommendationCache) return false;

                const now = Date.now();
                return now < recommendationCache.expiresAt;
            },

            // Privacy settings
            setPrivacySettings: (settings) => {
                const current = get().privacySettings;
                set({
                    privacySettings: {
                        ...current,
                        ...settings,
                        consentUpdatedAt: Date.now(),
                    },
                });
            },

            isTrackingEnabled: () => {
                return get().privacySettings.trackingEnabled;
            },

            isPersonalizationEnabled: () => {
                return get().privacySettings.personalizationEnabled;
            },
        }),
        {
            name: 'starry-night-recommendations',
            // Only persist certain fields
            partialize: (state) => ({
                sessionId: state.sessionId,
                userId: state.userId,
                preferences: state.preferences,
                privacySettings: state.privacySettings,
                // Don't persist events or cache (too large)
            }),
        }
    )
);
