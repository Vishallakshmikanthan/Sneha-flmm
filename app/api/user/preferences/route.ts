import { NextRequest, NextResponse } from 'next/server';
import type {
    PreferencesApiResponse,
    UserPreferences,
} from '@/types/recommendation';

// ============================================================================
// GET /api/user/preferences - Get user preferences
// ============================================================================

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const sessionId = searchParams.get('sessionId');
        const userId = searchParams.get('userId');

        if (!sessionId) {
            return NextResponse.json<PreferencesApiResponse>(
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

        // TODO: Fetch from PostgreSQL database
        // For MVP, return default preferences
        const preferences: UserPreferences = {
            sessionId,
            userId: userId || undefined,
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
        };

        return NextResponse.json<PreferencesApiResponse>(
            {
                success: true,
                data: preferences,
                timestamp: Date.now(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching preferences:', error);

        return NextResponse.json<PreferencesApiResponse>(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch preferences',
                },
                timestamp: Date.now(),
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// POST /api/user/preferences - Update user preferences
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const preferences = body as UserPreferences;

        // Validate required fields
        if (!preferences.sessionId) {
            return NextResponse.json<PreferencesApiResponse>(
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

        // TODO: Store in PostgreSQL database
        console.log('Updating preferences:', preferences);

        // Update timestamp
        preferences.updatedAt = Date.now();

        return NextResponse.json<PreferencesApiResponse>(
            {
                success: true,
                data: preferences,
                timestamp: Date.now(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating preferences:', error);

        return NextResponse.json<PreferencesApiResponse>(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to update preferences',
                },
                timestamp: Date.now(),
            },
            { status: 500 }
        );
    }
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        }
    );
}
