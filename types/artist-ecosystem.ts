// Artist Ecosystem & Marketplace Governance Type Definitions

// ============================================================================
// Artist Application System
// ============================================================================

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'featured';

export interface ArtistApplication {
    id: string;
    applicantEmail: string;
    applicantName: string;
    submittedAt: Date;
    status: ApplicationStatus;
    portfolio: PortfolioSubmission;
    styleClassification: StyleClassification;
    artisticVision: string;
    identityVerification: IdentityVerification;
    reviewData?: ApplicationReview;
}

export interface PortfolioSubmission {
    images: PortfolioImage[];
    description: string;
    websiteUrl?: string;
}

export interface PortfolioImage {
    id: string;
    url: string;
    title: string;
    medium: string;
    year: number;
    dimensions?: string;
}

export interface StyleClassification {
    primaryStyle: ArtStyle;
    secondaryStyles: ArtStyle[];
    techniques: string[];
}

export type ArtStyle =
    | 'abstract'
    | 'contemporary'
    | 'impressionism'
    | 'expressionism'
    | 'minimalist'
    | 'surrealism'
    | 'realism'
    | 'pop_art'
    | 'digital'
    | 'mixed_media'
    | 'traditional'
    | 'other';

export interface IdentityVerification {
    documentType: 'passport' | 'drivers_license' | 'national_id';
    documentUrl: string;
    verified: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
}

export interface ApplicationReview {
    reviewerId: string;
    reviewerName: string;
    reviewedAt: Date;
    decision: 'approved' | 'rejected';
    feedback: string;
    aiPreScreeningScore?: number;
    criteria: ReviewCriteria;
}

export interface ReviewCriteria {
    originality: number; // 1-10
    technicalSkill: number; // 1-10
    artisticConsistency: number; // 1-10
    marketFit: number; // 1-10
    overallScore: number; // 1-10
}

// ============================================================================
// Enhanced Artist Profile
// ============================================================================

export interface EnhancedArtist {
    id: string;
    slug: string;
    name: string;
    email: string;

    // Basic Info
    bio: string;
    artisticPhilosophy: string;
    imageUrl: string;
    coverImageUrl?: string;

    // Classification
    era: string;
    primaryStyle: ArtStyle;
    styleTags: string[];

    // Status & Verification
    verified: boolean;
    verifiedAt?: Date;
    featured: boolean;
    approvalStatus: ApplicationStatus;
    joinedAt: Date;

    // Social Links
    socialLinks: SocialLinks;

    // Commission & Tier
    commissionTier: CommissionTier;

    // Statistics
    artworkCount: number;
    totalSales: number;
    averageRating: number;

    // Reputation
    reputationScore: number;
    badges: ArtistBadge[];

    // Optional Features
    studioInsights?: StudioInsight[];
    processVideos?: ProcessVideo[];
    limitedEditionCollections?: string[]; // Collection IDs
}

export interface SocialLinks {
    website?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    behance?: string;
    artstation?: string;
}

export interface StudioInsight {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    publishedAt: Date;
}

export interface ProcessVideo {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number; // in seconds
    publishedAt: Date;
}

// ============================================================================
// Commission Structure
// ============================================================================

export type CommissionTier = 'base' | 'featured' | 'limited_edition';

export interface CommissionStructure {
    tier: CommissionTier;
    rate: number; // percentage (e.g., 20 for 20%)
    description: string;
}

export const COMMISSION_RATES: Record<CommissionTier, number> = {
    base: 20,
    featured: 15,
    limited_edition: 25,
};

export interface CommissionCalculation {
    artworkId: string;
    salePrice: number;
    commissionTier: CommissionTier;
    commissionRate: number;
    commissionAmount: number;
    artistPayout: number;
    calculatedAt: Date;
}

export interface PayoutCycle {
    id: string;
    artistId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    totalSales: number;
    totalCommission: number;
    netPayout: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    payoutMethod: PayoutMethod;
    processedAt?: Date;
    transactionId?: string;
}

export interface PayoutMethod {
    type: 'bank_transfer' | 'stripe_connect';
    accountId: string;
    accountName: string;
}

export interface PayoutSettings {
    artistId: string;
    minimumThreshold: number;
    payoutMethod: PayoutMethod;
    autoPayoutEnabled: boolean;
}

// ============================================================================
// Limited Edition Governance
// ============================================================================

export interface LimitedEdition {
    id: string;
    artworkId: string;
    totalSupply: number;
    remaining: number;
    serialNumbers: SerialNumber[];
    certificates: Certificate[];
    editionRules: EditionRules;
    createdAt: Date;
    blockchainVerification?: BlockchainVerification;
}

export interface SerialNumber {
    serialId: string;
    number: number; // e.g., 1 of 10
    artworkId: string;
    status: 'available' | 'sold' | 'reserved';
    soldTo?: string; // buyer ID
    soldAt?: Date;
    certificateId?: string;
}

export interface Certificate {
    id: string;
    artworkId: string;
    serialNumber: number;
    artistId: string;
    artistName: string;
    artworkTitle: string;
    buyerId: string;
    buyerName: string;
    issuedAt: Date;
    certificateUrl: string; // PDF URL
    verificationCode: string;
    blockchainHash?: string;
}

export interface EditionRules {
    maxEditionCount: number;
    noDuplicationAcrossEditions: boolean;
    permanentRecord: boolean;
    authenticityProtection: boolean;
}

export interface BlockchainVerification {
    enabled: boolean;
    network?: string; // e.g., 'ethereum', 'polygon'
    contractAddress?: string;
    tokenId?: string;
    transactionHash?: string;
    verifiedAt?: Date;
}

// ============================================================================
// Buyer Protection & Policies
// ============================================================================

export interface RefundPolicy {
    digitalRefundWindow: number; // days
    physicalRefundWindow: number; // days
    eligibilityCriteria: string[];
    exclusions: string[];
}

export interface RefundRequest {
    id: string;
    orderId: string;
    artworkId: string;
    buyerId: string;
    reason: RefundReason;
    description: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    requestedAt: Date;
    processedAt?: Date;
    refundAmount?: number;
}

export type RefundReason =
    | 'not_as_described'
    | 'damaged'
    | 'quality_issues'
    | 'changed_mind'
    | 'duplicate_purchase'
    | 'other';

export interface DamageClaim {
    id: string;
    orderId: string;
    artworkId: string;
    buyerId: string;
    description: string;
    evidenceUrls: string[]; // photos of damage
    status: 'pending' | 'investigating' | 'approved' | 'rejected' | 'resolved';
    submittedAt: Date;
    resolvedAt?: Date;
    resolution?: string;
}

export interface AuthenticityGuarantee {
    artworkId: string;
    artistVerified: boolean;
    certificateIncluded: boolean;
    limitedEditionTransparency: boolean;
    platformVerification: boolean;
    guaranteeDetails: string;
}

// ============================================================================
// Reputation System
// ============================================================================

export interface ArtistReputation {
    artistId: string;
    score: number; // 0-100
    badges: ArtistBadge[];
    metrics: ReputationMetrics;
    calculatedAt: Date;
    history: ReputationHistory[];
}

export interface ReputationMetrics {
    salesVolume: number;
    customerRatings: {
        average: number;
        count: number;
    };
    returnRate: number; // percentage
    engagementRate: number; // percentage
    responseTime: number; // hours
    completionRate: number; // percentage
}

export type ArtistBadge =
    | 'rising_star'
    | 'master_artist'
    | 'collector_favorite'
    | 'limited_edition_specialist'
    | 'verified_artist'
    | 'featured_artist'
    | 'top_seller'
    | 'quick_responder';

export interface BadgeDefinition {
    badge: ArtistBadge;
    name: string;
    description: string;
    criteria: string;
    iconUrl: string;
    color: string;
}

export interface ReputationHistory {
    date: Date;
    score: number;
    change: number;
    reason: string;
}

// ============================================================================
// Analytics & Metrics
// ============================================================================

export interface ArtistAnalytics {
    artistId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    metrics: AnalyticsMetrics;
    demographics: AudienceDemographics;
    topArtworks: ArtworkPerformance[];
}

export interface AnalyticsMetrics {
    views: {
        total: number;
        unique: number;
        trend: TrendData[];
    };
    clickThroughRate: {
        rate: number; // percentage
        clicks: number;
        impressions: number;
    };
    conversionRate: {
        rate: number; // percentage
        conversions: number;
        visitors: number;
    };
    revenue: {
        total: number;
        averageSalePrice: number;
        trend: TrendData[];
    };
}

export interface TrendData {
    date: Date;
    value: number;
}

export interface AudienceDemographics {
    geographic: GeographicData[];
    devices: DeviceData[];
    timeOfDay: TimeOfDayData[];
    referralSources: ReferralData[];
}

export interface GeographicData {
    country: string;
    countryCode: string;
    visitors: number;
    percentage: number;
}

export interface DeviceData {
    deviceType: 'desktop' | 'mobile' | 'tablet';
    visitors: number;
    percentage: number;
}

export interface TimeOfDayData {
    hour: number; // 0-23
    visitors: number;
}

export interface ReferralData {
    source: string;
    visitors: number;
    percentage: number;
}

export interface ArtworkPerformance {
    artworkId: string;
    title: string;
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    conversionRate: number;
}

// ============================================================================
// Curation System
// ============================================================================

export interface CuratedCollection {
    id: string;
    slug: string;
    title: string;
    description: string;
    theme: CollectionTheme;
    artworkIds: string[];
    coverImageUrl: string;
    curatorId: string;
    curatorName: string;
    featured: boolean;
    publishedAt: Date;
    expiresAt?: Date;
}

export type CollectionTheme =
    | 'seasonal'
    | 'artistic_movement'
    | 'storytelling'
    | 'editorial_pick'
    | 'trending'
    | 'new_arrivals'
    | 'limited_editions'
    | 'featured_artists';

export interface EditorialPick {
    id: string;
    artworkId: string;
    position: number;
    reason: string;
    pickedBy: string;
    pickedAt: Date;
    expiresAt?: Date;
}

export interface TrendingArtwork {
    artworkId: string;
    trendingScore: number;
    rank: number;
    calculatedAt: Date;
}

// ============================================================================
// Anti-Abuse & Quality Control
// ============================================================================

export interface DuplicateDetectionResult {
    artworkId: string;
    potentialDuplicates: PotentialDuplicate[];
    detectedAt: Date;
}

export interface PotentialDuplicate {
    artworkId: string;
    similarityScore: number; // 0-100
    matchType: 'image_hash' | 'metadata' | 'visual_similarity';
    requiresReview: boolean;
}

export interface PlagiarismScanResult {
    artworkId: string;
    scanStatus: 'pending' | 'scanning' | 'completed' | 'failed';
    plagiarismScore: number; // 0-100
    matches: PlagiarismMatch[];
    scannedAt: Date;
}

export interface PlagiarismMatch {
    sourceUrl: string;
    similarityScore: number;
    matchType: 'exact' | 'partial' | 'style';
    confidence: number;
}

export interface FraudAlert {
    id: string;
    type: 'payment' | 'behavior' | 'identity' | 'content';
    severity: 'low' | 'medium' | 'high' | 'critical';
    entityId: string; // artist ID, buyer ID, or artwork ID
    entityType: 'artist' | 'buyer' | 'artwork';
    description: string;
    detectedAt: Date;
    status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
    resolvedAt?: Date;
    resolution?: string;
}

// ============================================================================
// Pricing & Market Data
// ============================================================================

export interface PricingGuidance {
    artworkId: string;
    recommendedRange: {
        min: number;
        max: number;
    };
    marketComparison: MarketComparison[];
    factors: PricingFactor[];
}

export interface MarketComparison {
    artworkId: string;
    title: string;
    artist: string;
    price: number;
    similarity: number; // 0-100
    soldAt?: Date;
}

export interface PricingFactor {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
}

export interface PriceChangeHistory {
    artworkId: string;
    changes: PriceChange[];
}

export interface PriceChange {
    previousPrice: number;
    newPrice: number;
    changedAt: Date;
    reason?: string;
}

// ============================================================================
// Exclusivity & Scalability
// ============================================================================

export interface ExclusivityMetrics {
    totalApplications: number;
    approvedApplications: number;
    acceptanceRate: number; // percentage
    averageReviewTime: number; // days
    featuredArtistCount: number;
}

export interface ScalabilityPhase {
    phase: 1 | 2 | 3;
    name: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    features: string[];
    metrics: {
        artistCount: number;
        artworkCount: number;
        salesVolume: number;
    };
}
