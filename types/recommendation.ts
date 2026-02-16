// Recommendation System Type Definitions

// ============================================================================
// User Interaction Events
// ============================================================================

export type EventType =
    | 'page_view'
    | 'artwork_click'
    | 'artwork_hover'
    | 'scroll_depth'
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'purchase'
    | 'wishlist_add'
    | 'wishlist_remove'
    | 'search_query'
    | 'category_view'
    | 'artist_view';

export interface BaseEvent {
    eventType: EventType;
    timestamp: number;
    sessionId: string;
    userId?: string; // Optional for anonymous users
}

export interface PageViewEvent extends BaseEvent {
    eventType: 'page_view';
    pageUrl: string;
    referrer?: string;
}

export interface ArtworkClickEvent extends BaseEvent {
    eventType: 'artwork_click';
    artworkId: string;
    artworkTitle: string;
    category: string;
    price: number;
    position: number; // Position in list/grid
    context: 'homepage' | 'gallery' | 'recommendation' | 'search' | 'artist_page';
}

export interface ArtworkHoverEvent extends BaseEvent {
    eventType: 'artwork_hover';
    artworkId: string;
    duration: number; // milliseconds
}

export interface ScrollDepthEvent extends BaseEvent {
    eventType: 'scroll_depth';
    pageUrl: string;
    depth: number; // 0-100 percentage
    maxDepth: number;
}

export interface CartEvent extends BaseEvent {
    eventType: 'add_to_cart' | 'remove_from_cart';
    artworkId: string;
    price: number;
    quantity: number;
}

export interface PurchaseEvent extends BaseEvent {
    eventType: 'purchase';
    orderId: string;
    artworkIds: string[];
    totalAmount: number;
    itemCount: number;
}

export interface WishlistEvent extends BaseEvent {
    eventType: 'wishlist_add' | 'wishlist_remove';
    artworkId: string;
}

export interface SearchQueryEvent extends BaseEvent {
    eventType: 'search_query';
    query: string;
    resultsCount: number;
}

export interface CategoryViewEvent extends BaseEvent {
    eventType: 'category_view';
    categoryId: string;
    categoryName: string;
}

export interface ArtistViewEvent extends BaseEvent {
    eventType: 'artist_view';
    artistId: string;
    artistName: string;
}

export type UserEvent =
    | PageViewEvent
    | ArtworkClickEvent
    | ArtworkHoverEvent
    | ScrollDepthEvent
    | CartEvent
    | PurchaseEvent
    | WishlistEvent
    | SearchQueryEvent
    | CategoryViewEvent
    | ArtistViewEvent;

// ============================================================================
// User Features & Preferences
// ============================================================================

export interface UserPreferences {
    userId?: string;
    sessionId: string;

    // Category preferences (normalized scores 0-1)
    categoryAffinity: Record<string, number>;

    // Price range preference
    priceRange: {
        min: number;
        max: number;
        average: number;
    };

    // Color tone preferences
    colorPreferences: string[]; // ['blue', 'gold', 'pastel', etc.]

    // Art style affinity
    styleAffinity: Record<string, number>; // { 'abstract': 0.8, 'renaissance': 0.3 }

    // Era preferences
    eraAffinity: Record<string, number>;

    // Artist preferences
    favoriteArtists: string[];

    // Behavioral metrics
    purchaseFrequency: number; // purchases per month
    averageSessionDuration: number; // minutes
    totalSpent: number;

    // Timestamps
    firstSeen: number;
    lastSeen: number;
    updatedAt: number;
}

export interface UserBehaviorMetrics {
    userId?: string;
    sessionId: string;

    // Engagement metrics
    totalPageViews: number;
    totalArtworkClicks: number;
    averageHoverDuration: number;
    averageScrollDepth: number;

    // Interaction frequency
    sessionsCount: number;
    averageSessionDuration: number;
    daysSinceFirstVisit: number;
    daysSinceLastVisit: number;

    // Category diversity (0-1, higher = more diverse)
    categoryDiversity: number;

    // Purchase behavior
    purchaseCount: number;
    totalSpent: number;
    averageOrderValue: number;

    // Engagement score (0-100)
    engagementScore: number;
}

// User segmentation
export type UserSegment =
    | 'casual_browser'
    | 'emerging_collector'
    | 'premium_buyer'
    | 'art_enthusiast'
    | 'new_visitor';

export interface UserSegmentation {
    userId?: string;
    sessionId: string;
    segment: UserSegment;
    confidence: number; // 0-1
    assignedAt: number;
}

// ============================================================================
// Artwork Features
// ============================================================================

export interface ArtworkFeatures {
    artworkId: string;

    // Basic metadata
    category: string;
    era: string;
    medium: string;
    artist: string;
    artistId: string;

    // Pricing
    price: number;
    priceCategory: 'budget' | 'mid_range' | 'premium' | 'luxury';

    // Visual features
    dominantColors: string[]; // ['#D4AF37', '#0B0F1A', ...]
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
    };

    // Content tags
    tags: string[]; // ['landscape', 'night', 'impressionism', ...]

    // Style vector (for advanced similarity)
    styleVector?: number[]; // Embedding vector

    // Popularity metrics
    popularityScore: number; // 0-100
    viewCount: number;
    clickThroughRate: number;
    conversionRate: number;

    // Limited edition info
    isLimitedEdition: boolean;
    editionSize?: number;
    editionsRemaining?: number;

    // Timestamps
    createdAt: number;
    updatedAt: number;
}

// ============================================================================
// Recommendation Requests & Responses
// ============================================================================

export interface RecommendationRequest {
    userId?: string;
    sessionId: string;

    // Context
    context: 'homepage' | 'gallery' | 'artwork_detail' | 'cart' | 'search';
    currentArtworkId?: string; // For "similar artworks"
    currentCategory?: string;

    // Filters
    excludeArtworkIds?: string[]; // Already purchased/viewed
    categoryFilter?: string[];
    priceRange?: {
        min: number;
        max: number;
    };

    // Pagination
    limit: number;
    offset?: number;
}

export interface RecommendationResponse {
    recommendations: RecommendedArtwork[];
    metadata: {
        algorithm: 'content_based' | 'collaborative' | 'hybrid' | 'trending' | 'popular';
        confidence: number; // 0-1
        generatedAt: number;
        responseTime: number; // milliseconds
    };
}

export interface RecommendedArtwork {
    artworkId: string;
    score: number; // 0-1 relevance score
    reason?: string; // "Because you liked Starry Night"
    rank: number;

    // Include full artwork data for display
    artwork: {
        id: string;
        title: string;
        artist: string;
        artistId: string;
        category: string;
        price: number;
        imageUrl: string;
        featured: boolean;
    };
}

// ============================================================================
// Recommendation Cache
// ============================================================================

export interface RecommendationCache {
    sessionId: string;
    userId?: string;

    // Cached recommendations by context
    homepage?: RecommendationResponse;
    gallery?: RecommendationResponse;
    similarArtworks?: Record<string, RecommendationResponse>; // artworkId -> recommendations

    // Cache metadata
    cachedAt: number;
    expiresAt: number;
}

// ============================================================================
// Analytics & Metrics
// ============================================================================

export interface RecommendationMetrics {
    // Performance metrics
    impressions: number; // How many times shown
    clicks: number;
    conversions: number; // Purchases from recommendations

    // Rates
    clickThroughRate: number; // clicks / impressions
    conversionRate: number; // conversions / clicks

    // Revenue
    revenueGenerated: number;
    averageOrderValue: number;

    // By algorithm
    metricsByAlgorithm: Record<string, {
        impressions: number;
        clicks: number;
        conversions: number;
        ctr: number;
        conversionRate: number;
    }>;

    // Time period
    startDate: number;
    endDate: number;
}

// ============================================================================
// Privacy & Consent
// ============================================================================

export interface PrivacySettings {
    sessionId: string;
    userId?: string;

    // Consent flags
    personalizationEnabled: boolean;
    trackingEnabled: boolean;
    analyticsEnabled: boolean;

    // Timestamps
    consentGivenAt?: number;
    consentUpdatedAt?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    timestamp: number;
}

export type TrackingApiResponse = ApiResponse<{ eventId: string }>;
export type RecommendationApiResponse = ApiResponse<RecommendationResponse>;
export type PreferencesApiResponse = ApiResponse<UserPreferences>;
