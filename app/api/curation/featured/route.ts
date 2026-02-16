import { NextResponse } from 'next/server';
import { mockCuratedCollections, getFeaturedCollections } from '@/lib/data/curated-collections';

/**
 * GET /api/curation/featured
 * Get featured curated collections
 */
export async function GET() {
    try {
        const featured = getFeaturedCollections();

        return NextResponse.json({
            success: true,
            data: featured,
            count: featured.length,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch featured collections',
            },
            { status: 500 }
        );
    }
}
