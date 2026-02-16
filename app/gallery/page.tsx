import { artworks } from "@/lib/data/artworks";
import ArtworkGrid from "@/components/gallery/ArtworkGrid";
import FilterBar from "@/components/gallery/FilterBar";

export default function GalleryPage() {
    return (
        <main className="min-h-screen pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-8xl font-display mb-6 text-gold">
                        Gallery
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Explore our curated collection of timeless masterpieces
                    </p>
                </div>

                {/* Filter Bar */}
                <FilterBar />

                {/* Artwork Grid */}
                <ArtworkGrid artworks={artworks} />
            </div>
        </main>
    );
}
