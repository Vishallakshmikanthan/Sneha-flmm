'use client';

import { MembershipTier, MEMBERSHIP_TIERS } from '@/types/membership';
import { DropCountdown } from '@/types/early-access';
import { formatTimeRemaining } from '@/lib/early-access-manager';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EarlyAccessBadgeProps {
    countdown: DropCountdown;
    compact?: boolean;
}

export default function EarlyAccessBadge({ countdown, compact = false }: EarlyAccessBadgeProps) {
    const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(countdown.accessEndsIn));
    const tierDef = MEMBERSHIP_TIERS[countdown.collectorTier];

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(formatTimeRemaining(countdown.accessEndsIn));
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown.accessEndsIn]);

    if (countdown.status === 'ended') {
        return null;
    }

    if (compact) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 backdrop-blur-md border border-[#D4AF37]/30 rounded-full"
            >
                <span className="text-[#D4AF37] text-xs font-bold">⚡ VIP EARLY ACCESS</span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#F5E6C4]/10 backdrop-blur-md border border-[#D4AF37]/30 p-4"
        >
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-[#F5E6C4]/20 to-[#D4AF37]/10 animate-pulse" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{tierDef.icon}</span>
                        <div>
                            <p className="text-[#D4AF37] font-bold text-sm">
                                ⚡ VIP EARLY ACCESS
                            </p>
                            <p className="text-gray-300 text-xs">
                                {tierDef.name} Members Only
                            </p>
                        </div>
                    </div>

                    {countdown.status === 'ending_soon' && (
                        <div className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                            <p className="text-red-400 text-xs font-bold">ENDING SOON</p>
                        </div>
                    )}
                </div>

                {/* Countdown Timer */}
                {countdown.status === 'active' && (
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-white text-2xl font-bold font-mono">
                                    {timeRemaining}
                                </span>
                                <span className="text-gray-400 text-sm">remaining</span>
                            </div>
                        </div>
                    </div>
                )}

                {countdown.status === 'upcoming' && (
                    <div>
                        <p className="text-white text-sm">
                            Starts in{' '}
                            <span className="font-bold font-mono">
                                {formatTimeRemaining(countdown.accessStartsIn)}
                            </span>
                        </p>
                    </div>
                )}

                {/* Progress Bar */}
                {countdown.status === 'active' && (
                    <div className="mt-3">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{
                                    width: `${(countdown.accessEndsIn / (tierDef.earlyAccessHours * 60 * 60 * 1000)) * 100}%`,
                                }}
                                transition={{ duration: 1 }}
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6C4]"
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
