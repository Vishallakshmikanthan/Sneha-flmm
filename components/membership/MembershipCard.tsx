'use client';

import { MembershipTier, MEMBERSHIP_TIERS } from '@/types/membership';
import { getTierColor, getTierIcon, getTierDisplayName } from '@/lib/membership-manager';
import { motion } from 'framer-motion';

interface MembershipCardProps {
    tier: MembershipTier;
    subscriptionActive: boolean;
    totalPurchases: number;
    totalSpend: number;
    nextTierProgress?: number;
    onUpgrade?: () => void;
}

export default function MembershipCard({
    tier,
    subscriptionActive,
    totalPurchases,
    totalSpend,
    nextTierProgress,
    onUpgrade,
}: MembershipCardProps) {
    const tierDef = MEMBERSHIP_TIERS[tier];
    const tierColor = getTierColor(tier);
    const tierIcon = getTierIcon(tier);

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F1B2E] to-[#0B0F1A] border border-white/10 p-6"
        >
            {/* Background Glow Effect */}
            <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
                style={{ background: tierColor }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{tierIcon}</span>
                        <div>
                            <h3 className="text-2xl font-serif text-white">
                                {getTierDisplayName(tier)}
                            </h3>
                            <p className="text-sm text-gray-400">{tierDef.description}</p>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${subscriptionActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}
                >
                    {subscriptionActive ? 'Active' : 'Inactive'}
                </div>
            </div>

            {/* Stats */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Total Purchases</p>
                    <p className="text-white text-2xl font-bold">{totalPurchases}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                    <p className="text-white text-2xl font-bold">
                        ${totalSpend.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Benefits */}
            <div className="relative z-10 mb-6">
                <h4 className="text-white font-semibold mb-3">Your Benefits</h4>
                <ul className="space-y-2">
                    {tierDef.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-[#D4AF37] mt-0.5">✓</span>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Progress to Next Tier */}
            {nextTierProgress !== undefined && nextTierProgress < 100 && (
                <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-400">Progress to Next Tier</p>
                        <p className="text-sm font-semibold" style={{ color: tierColor }}>
                            {Math.round(nextTierProgress)}%
                        </p>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${nextTierProgress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: tierColor }}
                        />
                    </div>
                </div>
            )}

            {/* Upgrade CTA */}
            {onUpgrade && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onUpgrade}
                    style={{
                        background: `linear-gradient(135deg, ${tierColor}22, ${tierColor}44)`,
                        border: `1px solid ${tierColor}66`,
                    }}
                    className="relative z-10 w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300"
                >
                    {subscriptionActive ? 'Manage Membership' : 'Upgrade Membership'}
                </motion.button>
            )}
        </motion.div>
    );
}
