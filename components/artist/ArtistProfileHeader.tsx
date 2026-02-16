/* eslint-disable react/no-unescaped-entities */
'use client';

import { Artist } from '@/types/artwork';
import ArtistBadges from './ArtistBadges';
import { motion } from 'framer-motion';
import { ArtistBadge } from '@/types/artist-ecosystem';
import Image from 'next/image';

interface ArtistProfileHeaderProps {
    artist: Artist;
}

export default function ArtistProfileHeader({ artist }: ArtistProfileHeaderProps) {
    return (
        <div className="relative">
            {/* Cover Image */}
            {artist.coverImageUrl && (
                <div className="w-full h-64 md:h-96 relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${artist.coverImageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0F1A]/50 to-[#0B0F1A]" />
                </div>
            )}

            {/* Profile Content */}
            <div className="container mx-auto px-4 -mt-24 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                    {/* Profile Image */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-2xl">
                            <Image
                                src={artist.imageUrl}
                                alt={artist.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 160px, 192px"
                            />
                        </div>

                        {/* Verified Badge */}
                        {artist.verified && (
                            <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#2ECC71] rounded-full flex items-center justify-center border-4 border-[#0B0F1A] shadow-lg">
                                <span className="text-white text-lg">✓</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Artist Info */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl md:text-5xl font-serif text-white">
                                    {artist.name}
                                </h1>
                                {artist.featured && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#F5E6C4] text-[#0B0F1A] text-sm font-bold rounded-full">
                                        FEATURED
                                    </span>
                                )}
                            </div>

                            <p className="text-[#D4AF37] text-lg mb-3">{artist.era}</p>

                            {/* Badges */}
                            {artist.badges && artist.badges.length > 0 && (
                                <div className="mb-4">
                                    <ArtistBadges
                                        badges={artist.badges as ArtistBadge[]}
                                        size="md"
                                    />
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div>
                                    <p className="text-gray-400">Artworks</p>
                                    <p className="text-white font-semibold text-lg">
                                        {artist.artworkCount}
                                    </p>
                                </div>

                                {artist.totalSales !== undefined && (
                                    <div>
                                        <p className="text-gray-400">Total Sales</p>
                                        <p className="text-white font-semibold text-lg">
                                            {artist.totalSales}
                                        </p>
                                    </div>
                                )}

                                {artist.averageRating !== undefined && (
                                    <div>
                                        <p className="text-gray-400">Rating</p>
                                        <p className="text-white font-semibold text-lg">
                                            {artist.averageRating.toFixed(1)} ⭐
                                        </p>
                                    </div>
                                )}

                                {artist.reputationScore !== undefined && (
                                    <div>
                                        <p className="text-gray-400">Reputation</p>
                                        <p className="text-white font-semibold text-lg">
                                            {artist.reputationScore}/100
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Social Links */}
                            {artist.socialLinks && (
                                <div className="flex gap-3 mt-4">
                                    {artist.socialLinks.website && (
                                        <a
                                            href={artist.socialLinks.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all"
                                        >
                                            🌐
                                        </a>
                                    )}
                                    {artist.socialLinks.instagram && (
                                        <a
                                            href={`https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all"
                                        >
                                            📷
                                        </a>
                                    )}
                                    {artist.socialLinks.twitter && (
                                        <a
                                            href={`https://twitter.com/${artist.socialLinks.twitter.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all"
                                        >
                                            🐦
                                        </a>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Bio and Philosophy */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 grid md:grid-cols-2 gap-6"
                >
                    {/* Biography */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-serif text-[#D4AF37] mb-3">Biography</h2>
                        <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
                    </div>

                    {/* Artistic Philosophy */}
                    {artist.artisticPhilosophy && (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-serif text-[#D4AF37] mb-3">
                                Artistic Philosophy
                            </h2>
                            <p className="text-gray-300 leading-relaxed italic">
                                "{artist.artisticPhilosophy}"
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Style Tags */}
                {artist.styleTags && artist.styleTags.length > 0 && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-6"
                    >
                        <div className="flex flex-wrap gap-2">
                            {artist.styleTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
