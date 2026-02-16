import { NextResponse } from 'next/server';
import { mockApplications, getApplicationsByStatus } from '@/lib/data/artist-applications';

/**
 * GET /api/artist/applications
 * Get all artist applications (admin only in production)
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    try {
        let applications = mockApplications;

        // Filter by status if provided
        if (status) {
            applications = getApplicationsByStatus(status as 'pending' | 'approved' | 'rejected' | 'under_review');
        }

        return NextResponse.json({
            success: true,
            data: applications,
            count: applications.length,
        });
    } catch (error: unknown) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch applications',
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/artist/applications
 * Submit a new artist application
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = [
            'applicantEmail',
            'applicantName',
            'portfolio',
            'styleClassification',
            'artisticVision',
            'identityVerification',
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Missing required field: ${field}`,
                    },
                    { status: 400 }
                );
            }
        }

        // In production, this would save to database
        const newApplication = {
            id: `app-${Date.now()}`,
            ...body,
            submittedAt: new Date(),
            status: 'pending' as const,
        };

        return NextResponse.json(
            {
                success: true,
                data: newApplication,
                message: 'Application submitted successfully',
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error submitting application:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to submit application',
            },
            { status: 500 }
        );
    }
}
