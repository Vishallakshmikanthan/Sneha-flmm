import { ArtistApplication, ApplicationStatus } from '@/types/artist-ecosystem';

/**
 * Mock artist application data
 */
export const mockApplications: ArtistApplication[] = [
    {
        id: 'app-001',
        applicantEmail: 'emma.chen@example.com',
        applicantName: 'Emma Chen',
        submittedAt: new Date('2026-02-10T10:30:00'),
        status: 'pending',
        portfolio: {
            images: [
                {
                    id: 'port-001-1',
                    url: '/images/portfolio/emma-chen-1.jpg',
                    title: 'Urban Dreams',
                    medium: 'Digital Art',
                    year: 2025,
                    dimensions: '3000x4000px',
                },
                {
                    id: 'port-001-2',
                    url: '/images/portfolio/emma-chen-2.jpg',
                    title: 'Neon Nights',
                    medium: 'Digital Art',
                    year: 2025,
                    dimensions: '4000x3000px',
                },
                {
                    id: 'port-001-3',
                    url: '/images/portfolio/emma-chen-3.jpg',
                    title: 'Cyber Garden',
                    medium: 'Mixed Media Digital',
                    year: 2026,
                    dimensions: '3500x3500px',
                },
            ],
            description: 'Contemporary digital artist exploring the intersection of nature and technology through vibrant, surreal compositions.',
            websiteUrl: 'https://emmachen.art',
        },
        styleClassification: {
            primaryStyle: 'digital',
            secondaryStyles: ['surrealism', 'contemporary'],
            techniques: ['digital painting', '3D rendering', 'photo manipulation'],
        },
        artisticVision: 'My work explores the delicate balance between organic life and digital existence. I create dreamlike worlds where nature reclaims technology, questioning our relationship with the digital age while celebrating the beauty of both realms.',
        identityVerification: {
            documentType: 'passport',
            documentUrl: '/documents/emma-chen-passport.pdf',
            verified: false,
        },
    },
    {
        id: 'app-002',
        applicantEmail: 'marcus.rivera@example.com',
        applicantName: 'Marcus Rivera',
        submittedAt: new Date('2026-02-08T14:20:00'),
        status: 'under_review',
        portfolio: {
            images: [
                {
                    id: 'port-002-1',
                    url: '/images/portfolio/marcus-rivera-1.jpg',
                    title: 'Solitude',
                    medium: 'Oil on Canvas',
                    year: 2024,
                    dimensions: '100x150cm',
                },
                {
                    id: 'port-002-2',
                    url: '/images/portfolio/marcus-rivera-2.jpg',
                    title: 'Morning Light',
                    medium: 'Oil on Canvas',
                    year: 2025,
                    dimensions: '120x180cm',
                },
                {
                    id: 'port-002-3',
                    url: '/images/portfolio/marcus-rivera-3.jpg',
                    title: 'Urban Silence',
                    medium: 'Oil on Canvas',
                    year: 2025,
                    dimensions: '90x120cm',
                },
            ],
            description: 'Traditional oil painter focusing on urban landscapes and the quiet moments of city life.',
            websiteUrl: 'https://marcusrivera.com',
        },
        styleClassification: {
            primaryStyle: 'realism',
            secondaryStyles: ['impressionism', 'contemporary'],
            techniques: ['oil painting', 'plein air', 'glazing'],
        },
        artisticVision: 'I capture the poetry of everyday urban moments - the way light falls on empty streets, the solitude within crowds, the beauty in architectural decay. My paintings are meditations on modern life.',
        identityVerification: {
            documentType: 'drivers_license',
            documentUrl: '/documents/marcus-rivera-license.pdf',
            verified: true,
            verifiedAt: new Date('2026-02-09T09:00:00'),
            verifiedBy: 'curator-001',
        },
        reviewData: {
            reviewerId: 'curator-001',
            reviewerName: 'Sarah Mitchell',
            reviewedAt: new Date('2026-02-09T16:30:00'),
            decision: 'approved',
            feedback: 'Exceptional technical skill and unique perspective on urban landscapes. Strong portfolio consistency.',
            aiPreScreeningScore: 92,
            criteria: {
                originality: 9,
                technicalSkill: 9,
                artisticConsistency: 8,
                marketFit: 8,
                overallScore: 8.5,
            },
        },
    },
    {
        id: 'app-003',
        applicantEmail: 'yuki.tanaka@example.com',
        applicantName: 'Yuki Tanaka',
        submittedAt: new Date('2026-02-05T11:45:00'),
        status: 'approved',
        portfolio: {
            images: [
                {
                    id: 'port-003-1',
                    url: '/images/portfolio/yuki-tanaka-1.jpg',
                    title: 'Zen Garden Series #1',
                    medium: 'Ink on Paper',
                    year: 2024,
                    dimensions: '50x70cm',
                },
                {
                    id: 'port-003-2',
                    url: '/images/portfolio/yuki-tanaka-2.jpg',
                    title: 'Bamboo Forest',
                    medium: 'Ink and Watercolor',
                    year: 2025,
                    dimensions: '60x80cm',
                },
                {
                    id: 'port-003-3',
                    url: '/images/portfolio/yuki-tanaka-3.jpg',
                    title: 'Mountain Mist',
                    medium: 'Ink on Silk',
                    year: 2025,
                    dimensions: '70x100cm',
                },
            ],
            description: 'Traditional Japanese ink artist blending classical sumi-e techniques with contemporary minimalism.',
            websiteUrl: 'https://yukitanaka.jp',
        },
        styleClassification: {
            primaryStyle: 'traditional',
            secondaryStyles: ['minimalist', 'abstract'],
            techniques: ['sumi-e', 'ink wash', 'calligraphy'],
        },
        artisticVision: 'Through the ancient art of sumi-e, I seek to capture the essence of nature with minimal strokes. Each line is a meditation, each composition a balance of presence and absence.',
        identityVerification: {
            documentType: 'passport',
            documentUrl: '/documents/yuki-tanaka-passport.pdf',
            verified: true,
            verifiedAt: new Date('2026-02-06T10:00:00'),
            verifiedBy: 'curator-002',
        },
        reviewData: {
            reviewerId: 'curator-002',
            reviewerName: 'James Park',
            reviewedAt: new Date('2026-02-06T14:00:00'),
            decision: 'approved',
            feedback: 'Masterful technique and beautiful integration of traditional and contemporary aesthetics. Perfect fit for our premium marketplace.',
            aiPreScreeningScore: 95,
            criteria: {
                originality: 8,
                technicalSkill: 10,
                artisticConsistency: 9,
                marketFit: 9,
                overallScore: 9,
            },
        },
    },
    {
        id: 'app-004',
        applicantEmail: 'sofia.martinez@example.com',
        applicantName: 'Sofia Martinez',
        submittedAt: new Date('2026-02-12T09:15:00'),
        status: 'rejected',
        portfolio: {
            images: [
                {
                    id: 'port-004-1',
                    url: '/images/portfolio/sofia-martinez-1.jpg',
                    title: 'Abstract #1',
                    medium: 'Acrylic on Canvas',
                    year: 2025,
                },
                {
                    id: 'port-004-2',
                    url: '/images/portfolio/sofia-martinez-2.jpg',
                    title: 'Abstract #2',
                    medium: 'Acrylic on Canvas',
                    year: 2025,
                },
            ],
            description: 'Emerging abstract artist experimenting with color and form.',
        },
        styleClassification: {
            primaryStyle: 'abstract',
            secondaryStyles: [],
            techniques: ['acrylic painting'],
        },
        artisticVision: 'I explore emotions through color and abstract forms.',
        identityVerification: {
            documentType: 'drivers_license',
            documentUrl: '/documents/sofia-martinez-license.pdf',
            verified: true,
            verifiedAt: new Date('2026-02-13T11:00:00'),
            verifiedBy: 'curator-001',
        },
        reviewData: {
            reviewerId: 'curator-001',
            reviewerName: 'Sarah Mitchell',
            reviewedAt: new Date('2026-02-13T15:30:00'),
            decision: 'rejected',
            feedback: 'While showing promise, the portfolio lacks the technical refinement and artistic consistency we require. We encourage reapplication after further development of your unique style.',
            aiPreScreeningScore: 62,
            criteria: {
                originality: 6,
                technicalSkill: 5,
                artisticConsistency: 5,
                marketFit: 6,
                overallScore: 5.5,
            },
        },
    },
];

/**
 * Get applications by status
 */
export function getApplicationsByStatus(status: ApplicationStatus): ArtistApplication[] {
    return mockApplications.filter((app) => app.status === status);
}

/**
 * Get application by ID
 */
export function getApplicationById(id: string): ArtistApplication | undefined {
    return mockApplications.find((app) => app.id === id);
}

/**
 * Get pending applications count
 */
export function getPendingApplicationsCount(): number {
    return mockApplications.filter((app) => app.status === 'pending').length;
}
