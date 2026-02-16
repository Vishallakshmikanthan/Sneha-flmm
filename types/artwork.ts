export interface Artwork {
    id: string;
    slug: string;
    title: string;
    artist: string;
    artistId: string;
    category: string;
    era: string;
    price: number;
    imageUrl: string;
    description: string;
    year: number;
    medium: string;
    dimensions: string;
    featured: boolean;
    inStock: boolean;
    limitedEdition?: {
        totalSupply: number;
        remaining: number;
        serialNumbers?: string[];
        certificateIds?: string[];
        editionRules?: {
            maxEditionCount: number;
            noDuplicationAcrossEditions: boolean;
        };
    };

    // Recommendation system fields
    tags?: string[]; // Searchable tags for content filtering
    colorPalette?: string[]; // Dominant colors for visual similarity
    styleVector?: number[]; // Artist style embedding (for advanced features)
    popularityScore?: number; // Engagement-based popularity metric (0-100)
}

export interface Category {
    id: string;
    slug: string;
    name: string;
    description: string;
    imageUrl: string;
    count: number;
}

export interface Artist {
    id: string;
    slug: string;
    name: string;
    email?: string;
    bio: string;
    artisticPhilosophy?: string;
    imageUrl: string;
    coverImageUrl?: string;
    era: string;
    primaryStyle?: string;
    styleTags?: string[];
    artworkCount: number;
    featured: boolean;
    verified?: boolean;
    verifiedAt?: Date;
    commissionTier?: 'base' | 'featured' | 'limited_edition';
    reputationScore?: number;
    badges?: string[];
    totalSales?: number;
    averageRating?: number;
    socialLinks?: {
        website?: string;
        instagram?: string;
        twitter?: string;
        facebook?: string;
        linkedin?: string;
        behance?: string;
        artstation?: string;
    };
    joinedAt?: Date;
}

export interface CartItem extends Artwork {
    quantity: number;
    addedAt: Date;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
