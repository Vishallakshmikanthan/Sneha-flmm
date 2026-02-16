import { create } from 'zustand';
import {
    CuratedCollection,
    EditorialPick,
    TrendingArtwork
} from '@/types/artist-ecosystem';

interface CurationState {
    // Featured content
    editorialPicks: EditorialPick[];
    curatedCollections: CuratedCollection[];
    trendingArtworks: TrendingArtwork[];

    // Loading states
    isLoading: boolean;

    // Actions
    setEditorialPicks: (picks: EditorialPick[]) => void;
    addEditorialPick: (pick: EditorialPick) => void;
    removeEditorialPick: (id: string) => void;

    setCuratedCollections: (collections: CuratedCollection[]) => void;
    addCuratedCollection: (collection: CuratedCollection) => void;
    updateCuratedCollection: (id: string, updates: Partial<CuratedCollection>) => void;
    removeCuratedCollection: (id: string) => void;

    setTrendingArtworks: (trending: TrendingArtwork[]) => void;

    setLoading: (loading: boolean) => void;

    // Reset
    reset: () => void;
}

const initialState = {
    editorialPicks: [],
    curatedCollections: [],
    trendingArtworks: [],
    isLoading: false,
};

export const useCurationStore = create<CurationState>((set) => ({
    ...initialState,

    setEditorialPicks: (picks) => set({ editorialPicks: picks }),

    addEditorialPick: (pick) =>
        set((state) => ({
            editorialPicks: [...state.editorialPicks, pick],
        })),

    removeEditorialPick: (id) =>
        set((state) => ({
            editorialPicks: state.editorialPicks.filter((pick) => pick.id !== id),
        })),

    setCuratedCollections: (collections) => set({ curatedCollections: collections }),

    addCuratedCollection: (collection) =>
        set((state) => ({
            curatedCollections: [...state.curatedCollections, collection],
        })),

    updateCuratedCollection: (id, updates) =>
        set((state) => ({
            curatedCollections: state.curatedCollections.map((collection) =>
                collection.id === id ? { ...collection, ...updates } : collection
            ),
        })),

    removeCuratedCollection: (id) =>
        set((state) => ({
            curatedCollections: state.curatedCollections.filter(
                (collection) => collection.id !== id
            ),
        })),

    setTrendingArtworks: (trending) => set({ trendingArtworks: trending }),

    setLoading: (loading) => set({ isLoading: loading }),

    reset: () => set(initialState),
}));
