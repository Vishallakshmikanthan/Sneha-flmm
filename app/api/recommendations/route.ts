import { NextRequest, NextResponse } from 'next/server';
import type {
    RecommendationRequest,
    RecommendationApiResponse,
    RecommendedArtwork,
} from '@/types/recommendation';
import { artworks } from '@/lib/data/artworks';

// ============================================================================
// GET /api/recommendations - Get personalized recommendations
// ============================================================================

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse request parameters
        const sessionId = searchParams.get('sessionId');
        // const userId = searchParams.get('userId'); // TODO: Use for personalization in Phase 2
        const context = searchParams.get('context') as RecommendationRequest['context'];
        const currentArtworkId = searchParams.get('currentArtworkId');
        const limit = parseInt(searchParams.get('limit') || '6', 10);

        // Validate required parameters
        if (!sessionId) {
            return NextResponse.json<RecommendationApiResponse>(
                {
                    success: false,
                    error: {
                        code: 'MISSING_SESSION_ID',
                        message: 'sessionId is required',
                    },
                    timestamp: Date.now(),
                },
                { status: 400 }
            );
        }

        // TODO: Implement actual recommendation logic
        // For Phase 1 MVP, we'll use simple content-based filtering

        const startTime = Date.now();
        let recommendations: RecommendedArtwork[];

        if (context === 'artwork_detail' && currentArtworkId) {
            // Similar artworks based on category
            recommendations = getSimilarArtworks(currentArtworkId, limit);
        } else {
            // General recommendations (trending/popular for now)
            recommendations = getTrendingArtworks(limit);
        }

        const responseTime = Date.now() - startTime;

        return NextResponse.json<RecommendationApiResponse>(
            {
                success: true,
                data: {
                    recommendations,
                    metadata: {
                        algorithm: context === 'artwork_detail' ? 'content_based' : 'trending',
                        confidence: 0.75,
                        generatedAt: Date.now(),
                        responseTime,
                    },
                },
                timestamp: Date.now(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error generating recommendations:', error);

        return NextResponse.json<RecommendationApiResponse>(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to generate recommendations',
                },
                timestamp: Date.now(),
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// Helper Functions - Simple Content-Based Filtering (Phase 1 MVP)
// ============================================================================

function getSimilarArtworks(artworkId: string, limit: number): RecommendedArtwork[] {
    const currentArtwork = artworks.find((a) => a.id === artworkId);
    if (!currentArtwork) {
        return getTrendingArtworks(limit);
    }

    // Find artworks in the same category
    const similar = artworks
        .filter((a) => a.id !== artworkId)
        .map((artwork) => {
            let score = 0;

            // Same category: +0.5
            if (artwork.category === currentArtwork.category) {
                score += 0.5;
            }

            // Same era: +0.3
            if (artwork.era === currentArtwork.era) {
                score += 0.3;
            }

            // Similar price range (within 30%): +0.2
            const priceDiff = Math.abs(artwork.price - currentArtwork.price);
            const priceRatio = priceDiff / currentArtwork.price;
            if (priceRatio < 0.3) {
                score += 0.2;
            }

            return { artwork, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return similar.map((item, index) => ({
        artworkId: item.artwork.id,
        score: item.score,
        reason: `Because you're viewing ${currentArtwork.title}`,
        rank: index + 1,
        artwork: {
            id: item.artwork.id,
            title: item.artwork.title,
            artist: item.artwork.artist,
            artistId: item.artwork.artistId,
            category: item.artwork.category,
            price: item.artwork.price,
            imageUrl: item.artwork.imageUrl,
            featured: item.artwork.featured,
        },
    }));
}

function getTrendingArtworks(limit: number): RecommendedArtwork[] {
    // For MVP, just return featured artworks
    const trending = artworks
        .filter((a) => a.featured)
        .slice(0, limit);

    return trending.map((artwork, index) => ({
        artworkId: artwork.id,
        score: 0.8 - index * 0.05, // Decreasing score
        reason: 'Trending now',
        rank: index + 1,
        artwork: {
            id: artwork.id,
            title: artwork.title,
            artist: artwork.artist,
            artistId: artwork.artistId,
            category: artwork.category,
            price: artwork.price,
            imageUrl: artwork.imageUrl,
            featured: artwork.featured,
        },
    }));
}

// ============================================================================
// OPTIONS - CORS preflight
// ============================================================================

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        }
    );
}
