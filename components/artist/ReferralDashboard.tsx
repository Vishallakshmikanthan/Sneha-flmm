'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getReferralShareLinks } from '@/lib/referral-manager';

interface ReferralDashboardProps {
    artistId: string;
    artistName: string;
    referralCode: string;
    metrics: {
        totalReferrals: number;
        pendingReferrals: number;
        approvedReferrals: number;
        totalRewardsEarned: number;
        rewardsPending: number;
    };
}

export default function ReferralDashboard({
    artistId,
    artistName,
    referralCode,
    metrics,
}: ReferralDashboardProps) {
    const [copied, setCopied] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://starrynight.art';
    const referralUrl = `${baseUrl}/artist/apply?ref=${referralCode}`;
    const shareLinks = getReferralShareLinks(referralCode);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-serif text-white mb-2">Artist Referral Program</h2>
                <p className="text-gray-400">
                    Invite talented artists and earn rewards when they join
                </p>
            </motion.div>

            {/* Referral Link */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-[#0F1B2E] to-[#0B0F1A] border border-white/10 rounded-2xl p-6"
            >
                <h3 className="text-white font-semibold mb-4">Your Unique Referral Link</h3>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={referralUrl}
                        readOnly
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopy}
                        className="px-6 py-3 bg-[#D4AF37] text-[#0B0F1A] rounded-lg font-semibold hover:bg-[#F5E6C4] transition-colors"
                    >
                        {copied ? '✓ Copied!' : 'Copy'}
                    </motion.button>
                </div>

                {/* Share Buttons */}
                <div className="flex flex-wrap gap-3">
                    <a
                        href={shareLinks.email}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-all"
                    >
                        📧 Email
                    </a>
                    <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-all"
                    >
                        🐦 Twitter
                    </a>
                    <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-all"
                    >
                        💼 LinkedIn
                    </a>
                    <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-all"
                    >
                        📘 Facebook
                    </a>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <div className="bg-gradient-to-br from-[#0F1B2E] to-[#0B0F1A] border border-white/10 rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Total Referrals</p>
                    <p className="text-white text-3xl font-bold">{metrics.totalReferrals}</p>
                </div>

                <div className="bg-gradient-to-br from-[#0F1B2E] to-[#0B0F1A] border border-white/10 rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Pending</p>
                    <p className="text-yellow-400 text-3xl font-bold">{metrics.pendingReferrals}</p>
                </div>

                <div className="bg-gradient-to-br from-[#0F1B2E] to-[#0B0F1A] border border-white/10 rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Approved</p>
                    <p className="text-green-400 text-3xl font-bold">{metrics.approvedReferrals}</p>
                </div>

                <div className="bg-gradient-to-br from-[#0F1B2E] to-[#0B0F1A] border border-[#D4AF37]/30 rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Rewards Earned</p>
                    <p className="text-[#D4AF37] text-3xl font-bold">
                        ${metrics.totalRewardsEarned.toLocaleString()}
                    </p>
                </div>
            </motion.div>

            {/* Rewards Info */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-[#0F1B2E] to-[#0B0F1A] border border-white/10 rounded-2xl p-6"
            >
                <h3 className="text-white font-semibold mb-4">How Rewards Work</h3>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#D4AF37]">1</span>
                        </div>
                        <div>
                            <p className="text-white font-medium">Artist Approved</p>
                            <p className="text-gray-400 text-sm">
                                Free homepage feature (1 week) - $500 value
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#D4AF37]">2</span>
                        </div>
                        <div>
                            <p className="text-white font-medium">First Sale</p>
                            <p className="text-gray-400 text-sm">
                                5% commission reduction for 3 months
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#D4AF37]">3</span>
                        </div>
                        <div>
                            <p className="text-white font-medium">5 Sales</p>
                            <p className="text-gray-400 text-sm">
                                $250 cash bonus
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#D4AF37]">4</span>
                        </div>
                        <div>
                            <p className="text-white font-medium">3+ Approved Referrals</p>
                            <p className="text-gray-400 text-sm">
                                Upgrade to Featured tier for 6 months
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
