import { artists } from '@/lib/data/artworks';
import { artworks } from '@/lib/data/artworks';
import ArtistProfileHeader from '@/components/artist/ArtistProfileHeader';
import ArtworkGrid from '@/components/gallery/ArtworkGrid';
import { notFound } from 'next/navigation';

interface ArtistPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
    const { id } = await params;
    const artist = artists.find((a) => a.id === id || a.slug === id);

    if (!artist) {
        notFound();
    }

    // Get artworks by this artist
    const artistArtworks = artworks.filter((artwork) => artwork.artistId === artist.id);

    return (
        <main className="min-h-screen bg-[#0B0F1A]">
            {/* Artist Profile Header */}
            <ArtistProfileHeader artist={artist} />

            {/* Artworks Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">
                        Artworks by {artist.name}
                    </h2>

                    {artistArtworks.length > 0 ? (
                        <ArtworkGrid artworks={artistArtworks} />
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">
                                No artworks available yet. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

// Generate static params for all artists
export async function generateStaticParams() {
    return artists.map((artist) => ({
        id: artist.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArtistPageProps) {
    const { id } = await params;
    const artist = artists.find((a) => a.id === id || a.slug === id);

    if (!artist) {
        return {
            title: 'Artist Not Found',
        };
    }

    return {
        title: `${artist.name} - Starry Night Art Marketplace`,
        description: artist.bio,
        openGraph: {
            title: artist.name,
            description: artist.bio,
            images: [artist.imageUrl],
        },
    };
}
