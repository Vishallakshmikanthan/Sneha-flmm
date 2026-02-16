import ScrollSequence from "@/components/animation/ScrollSequence";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedArt from "@/components/home/FeaturedArt";
import StorySection from "@/components/home/StorySection";
import { RecommendedForYou } from "@/components/recommendations/RecommendedForYou";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import { getFeaturedCollections } from "@/lib/data/curated-collections";
import TextReveal, { HeroTitle } from "@/components/ui/TextReveal";
import ScrollStorytelling from "@/components/home/ScrollStorytelling";

export default function Home() {
    const featuredCollections = getFeaturedCollections();

    return (
        <main className="min-h-screen text-white">
            <ScrollSequence
                imageSequenceSrc="/image-sequence-background"
                frameCount={1023}
                className="h-screen"
            />

            {/* Hero Overlays - Scrolling with page */}
            <div className="relative z-10">
                <section className="min-h-screen flex flex-col items-center justify-center p-8 pointer-events-none">
                    <div className="text-center max-w-5xl">
                        <HeroTitle className="text-7xl md:text-9xl lg:text-[11rem] font-bold mb-8 bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                            Starry Night
                        </HeroTitle>
                        <TextReveal className="text-3xl md:text-4xl text-gray-200/90 font-light" delay={1.5}>
                            Experience the cosmos in motion.
                        </TextReveal>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center p-8 pointer-events-none">
                    <div className="text-center max-w-6xl">
                        <TextReveal className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 text-white/90 drop-shadow-lg">
                            Curated Works
                        </TextReveal>
                        <TextReveal className="text-2xl md:text-4xl text-gray-300 font-light" delay={0.5}>
                            Discover premium digital art from around the world.
                        </TextReveal>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center p-8 pointer-events-none">
                    <div className="text-center max-w-6xl">
                        <TextReveal className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 text-white/90 drop-shadow-lg">
                            Join the Collective
                        </TextReveal>
                        <TextReveal className="text-2xl md:text-4xl text-gray-300 font-light" delay={0.5}>
                            Collectors, artists, and visionaries united.
                        </TextReveal>
                    </div>
                </section>

                <ScrollStorytelling />
                <StorySection />
                <CategoryGrid />
                <FeaturedArt />
                <FeaturedCollections collections={featuredCollections} />
                <RecommendedForYou limit={6} />
            </div>
        </main>
    );
}
