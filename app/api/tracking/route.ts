import { NextRequest, NextResponse } from 'next/server';
import type { UserEvent, TrackingApiResponse } from '@/types/recommendation';

// ============================================================================
// POST /api/tracking - Receive tracked events from frontend
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { events } = body as { events: UserEvent[] };

        // Validate events
        if (!Array.isArray(events) || events.length === 0) {
            return NextResponse.json<TrackingApiResponse>(
                {
                    success: false,
                    error: {
                        code: 'INVALID_EVENTS',
                        message: 'Events must be a non-empty array',
                    },
                    timestamp: Date.now(),
                },
                { status: 400 }
            );
        }

        // Validate each event has required fields
        for (const event of events) {
            if (!event.eventType || !event.timestamp || !event.sessionId) {
                return NextResponse.json<TrackingApiResponse>(
                    {
                        success: false,
                        error: {
                            code: 'INVALID_EVENT_FORMAT',
                            message: 'Each event must have eventType, timestamp, and sessionId',
                        },
                        timestamp: Date.now(),
                    },
                    { status: 400 }
                );
            }
        }

        // TODO: Store events in PostgreSQL database
        // For now, just log them (Phase 1 MVP)
        console.log(`Received ${events.length} events:`, events);

        // In production, you would:
        // 1. Insert events into PostgreSQL user_interactions table
        // 2. Update user preferences based on events
        // 3. Trigger background job for model retraining if threshold met

        // Generate event ID for response
        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return NextResponse.json<TrackingApiResponse>(
            {
                success: true,
                data: { eventId },
                timestamp: Date.now(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing tracking events:', error);

        return NextResponse.json<TrackingApiResponse>(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to process events',
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        }
    );
}
