import { create } from 'zustand';
import {
    EnhancedArtist,
    ArtistApplication,
    ArtistAnalytics,
    PayoutCycle,
    ArtistReputation
} from '@/types/artist-ecosystem';

interface ArtistState {
    // Current artist (for logged-in artist)
    currentArtist: EnhancedArtist | null;

    // Artist applications
    applications: ArtistApplication[];

    // Analytics data
    analytics: ArtistAnalytics | null;

    // Reputation data
    reputation: ArtistReputation | null;

    // Payout data
    payouts: PayoutCycle[];

    // Loading states
    isLoading: boolean;
    isLoadingAnalytics: boolean;
    isLoadingReputation: boolean;

    // Actions
    setCurrentArtist: (artist: EnhancedArtist | null) => void;
    updateArtistProfile: (updates: Partial<EnhancedArtist>) => void;

    setApplications: (applications: ArtistApplication[]) => void;
    addApplication: (application: ArtistApplication) => void;
    updateApplication: (id: string, updates: Partial<ArtistApplication>) => void;

    setAnalytics: (analytics: ArtistAnalytics | null) => void;
    setReputation: (reputation: ArtistReputation | null) => void;
    setPayouts: (payouts: PayoutCycle[]) => void;

    setLoading: (loading: boolean) => void;
    setLoadingAnalytics: (loading: boolean) => void;
    setLoadingReputation: (loading: boolean) => void;

    // Reset
    reset: () => void;
}

const initialState = {
    currentArtist: null,
    applications: [],
    analytics: null,
    reputation: null,
    payouts: [],
    isLoading: false,
    isLoadingAnalytics: false,
    isLoadingReputation: false,
};

export const useArtistStore = create<ArtistState>((set) => ({
    ...initialState,

    setCurrentArtist: (artist) => set({ currentArtist: artist }),

    updateArtistProfile: (updates) =>
        set((state) => ({
            currentArtist: state.currentArtist
                ? { ...state.currentArtist, ...updates }
                : null,
        })),

    setApplications: (applications) => set({ applications }),

    addApplication: (application) =>
        set((state) => ({
            applications: [...state.applications, application],
        })),

    updateApplication: (id, updates) =>
        set((state) => ({
            applications: state.applications.map((app) =>
                app.id === id ? { ...app, ...updates } : app
            ),
        })),

    setAnalytics: (analytics) => set({ analytics }),
    setReputation: (reputation) => set({ reputation }),
    setPayouts: (payouts) => set({ payouts }),

    setLoading: (loading) => set({ isLoading: loading }),
    setLoadingAnalytics: (loading) => set({ isLoadingAnalytics: loading }),
    setLoadingReputation: (loading) => set({ isLoadingReputation: loading }),

    reset: () => set(initialState),
}));
