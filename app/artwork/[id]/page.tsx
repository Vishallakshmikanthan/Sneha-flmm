import { artworks } from "@/lib/data/artworks";
import { notFound } from "next/navigation";
import ArtworkDetails from "@/components/artwork/ArtworkDetails";
import RelatedArtworks from "@/components/artwork/RelatedArtworks";
import { SimilarArtworks } from "@/components/recommendations/SimilarArtworks";
import ScrollSequence from "@/components/animation/ScrollSequence";

interface ArtworkPageProps {
    params: {
        id: string;
    };
}

export default function ArtworkPage({ params }: ArtworkPageProps) {
    const artwork = artworks.find((art) => art.id === params.id);

    if (!artwork) {
        notFound();
    }

    const relatedArtworks = artworks
        .filter((art) => art.category === artwork.category && art.id !== artwork.id)
        .slice(0, 3);

    return (
        <main className="min-h-screen text-white">
            {/* Scroll Sequence Background */}
            <ScrollSequence
                imageSequenceSrc="/image-sequence-background"
                frameCount={1023}
                className="h-screen"
            />

            {/* Hero Section */}
            <section className="min-h-[60vh] flex flex-col items-center justify-center p-8 relative z-10 pointer-events-none">
                <div className="text-center p-8 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 max-w-2xl">
                    <h1 className="text-5xl font-bold mb-4">{artwork.title}</h1>
                    <p className="text-xl text-gray-200">By {artwork.artist}</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 relative z-10 bg-black/80 backdrop-blur-md rounded-t-3xl min-h-screen">
                <ArtworkDetails artwork={artwork} />
                <SimilarArtworks
                    currentArtworkId={artwork.id}
                    currentArtworkTitle={artwork.title}
                    limit={4}
                />
                <RelatedArtworks artworks={relatedArtworks} />
            </div>
        </main>
    );
}

// Generate static params for all artworks
export function generateStaticParams() {
    return artworks.map((artwork) => ({
        id: artwork.id,
    }));
}
