import { artists } from "@/lib/data/artworks";

export default function ArtistsPage() {
    return (
        <main className="min-h-screen pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-8xl font-display mb-6 text-gold">
                        Artists
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Meet the masters behind the masterpieces
                    </p>
                </div>

                {/* Artists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {artists.map((artist) => (
                        <div
                            key={artist.id}
                            className="group relative rounded-2xl overflow-hidden glass p-6 hover:border-gold transition-all duration-300"
                        >
                            {/* Artist Image Placeholder */}
                            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/20 to-glow-blue/20 flex items-center justify-center">
                                <p className="text-4xl">👨‍🎨</p>
                            </div>

                            {/* Artist Info */}
                            <div className="text-center">
                                <h3 className="text-xl font-display mb-2 text-gold group-hover:text-gold-light transition-colors duration-300">
                                    {artist.name}
                                </h3>
                                <p className="text-sm text-text-muted mb-3">{artist.era}</p>
                                <p className="text-xs text-text-muted/70 line-clamp-3">
                                    {artist.bio}
                                </p>
                                <p className="text-sm text-gold mt-4">
                                    {artist.artworkCount} artworks
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
