import { CuratedCollection, CollectionTheme } from '@/types/artist-ecosystem';

/**
 * Mock curated collection data
 */
export const mockCuratedCollections: CuratedCollection[] = [
    {
        id: 'collection-001',
        slug: 'winter-serenity-2026',
        title: 'Winter Serenity',
        description: 'A curated selection of artworks capturing the quiet beauty and contemplative mood of winter. From snow-covered landscapes to minimalist compositions, these pieces evoke the peaceful stillness of the coldest season.',
        theme: 'seasonal',
        artworkIds: ['1', '3', '5'], // Starry Night, Great Wave, Girl with Pearl Earring
        coverImageUrl: '/images/collections/winter-serenity.jpg',
        curatorId: 'curator-001',
        curatorName: 'Sarah Mitchell',
        featured: true,
        publishedAt: new Date('2026-01-15T10:00:00'),
        expiresAt: new Date('2026-03-31T23:59:59'),
    },
    {
        id: 'collection-002',
        slug: 'abstract-pioneers',
        title: 'Abstract Pioneers',
        description: 'Celebrating the revolutionary artists who broke free from representational art. This collection showcases the bold experimentation and innovative techniques that defined the abstract art movement.',
        theme: 'artistic_movement',
        artworkIds: ['4'], // Composition VIII
        coverImageUrl: '/images/collections/abstract-pioneers.jpg',
        curatorId: 'curator-002',
        curatorName: 'James Park',
        featured: true,
        publishedAt: new Date('2026-02-01T10:00:00'),
    },
    {
        id: 'collection-003',
        slug: 'emotional-landscapes',
        title: 'Emotional Landscapes',
        description: 'Landscapes that transcend mere representation to capture the emotional essence of place. These artworks use color, composition, and technique to evoke powerful feelings and memories.',
        theme: 'storytelling',
        artworkIds: ['1', '3', '6'], // Starry Night, Great Wave, The Scream
        coverImageUrl: '/images/collections/emotional-landscapes.jpg',
        curatorId: 'curator-001',
        curatorName: 'Sarah Mitchell',
        featured: false,
        publishedAt: new Date('2026-01-20T10:00:00'),
    },
    {
        id: 'collection-004',
        slug: 'renaissance-masters',
        title: 'Renaissance Masters',
        description: 'The timeless beauty of Renaissance art. This collection features works that exemplify the period\'s mastery of technique, composition, and humanistic ideals.',
        theme: 'artistic_movement',
        artworkIds: ['2', '5'], // Birth of Venus, Girl with Pearl Earring
        coverImageUrl: '/images/collections/renaissance-masters.jpg',
        curatorId: 'curator-002',
        curatorName: 'James Park',
        featured: true,
        publishedAt: new Date('2026-01-10T10:00:00'),
    },
    {
        id: 'collection-005',
        slug: 'new-arrivals-february',
        title: 'New Arrivals - February 2026',
        description: 'Fresh additions to our marketplace this month. Discover the latest works from our curated community of artists.',
        theme: 'new_arrivals',
        artworkIds: ['4', '6'], // Composition VIII, The Scream
        coverImageUrl: '/images/collections/new-arrivals-feb.jpg',
        curatorId: 'curator-001',
        curatorName: 'Sarah Mitchell',
        featured: true,
        publishedAt: new Date('2026-02-01T00:00:00'),
        expiresAt: new Date('2026-02-28T23:59:59'),
    },
    {
        id: 'collection-006',
        slug: 'limited-edition-exclusives',
        title: 'Limited Edition Exclusives',
        description: 'Rare and exclusive limited edition artworks. Each piece in this collection is part of a numbered series, complete with certificate of authenticity.',
        theme: 'limited_editions',
        artworkIds: ['3'], // Great Wave (assuming it has limited editions)
        coverImageUrl: '/images/collections/limited-editions.jpg',
        curatorId: 'curator-002',
        curatorName: 'James Park',
        featured: true,
        publishedAt: new Date('2026-01-25T10:00:00'),
    },
];

/**
 * Get collections by theme
 */
export function getCollectionsByTheme(theme: CollectionTheme): CuratedCollection[] {
    return mockCuratedCollections.filter((collection) => collection.theme === theme);
}

/**
 * Get featured collections
 */
export function getFeaturedCollections(): CuratedCollection[] {
    return mockCuratedCollections.filter((collection) => collection.featured);
}

/**
 * Get collection by slug
 */
export function getCollectionBySlug(slug: string): CuratedCollection | undefined {
    return mockCuratedCollections.find((collection) => collection.slug === slug);
}

/**
 * Get collection by ID
 */
export function getCollectionById(id: string): CuratedCollection | undefined {
    return mockCuratedCollections.find((collection) => collection.id === id);
}

/**
 * Get active collections (not expired)
 */
export function getActiveCollections(): CuratedCollection[] {
    const now = new Date();
    return mockCuratedCollections.filter(
        (collection) => !collection.expiresAt || collection.expiresAt > now
    );
}
