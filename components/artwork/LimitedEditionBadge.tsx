'use client';

import { LimitedEdition } from '@/types/artist-ecosystem';
import { motion } from 'framer-motion';

interface LimitedEditionBadgeProps {
    limitedEdition: LimitedEdition;
    size?: 'sm' | 'md' | 'lg';
}

export default function LimitedEditionBadge({
    limitedEdition,
    size = 'md',
}: LimitedEditionBadgeProps) {
    const remaining = limitedEdition.remaining;
    const total = limitedEdition.totalSupply;
    const percentageRemaining = (remaining / total) * 100;

    const sizeClasses = {
        sm: 'text-xs px-3 py-1',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
    };

    return (
        <div className="space-y-3">
            {/* Limited Edition Badge */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F5E6C4] text-[#0B0F1A] font-bold rounded-full ${sizeClasses[size]}`}
            >
                <span>💎</span>
                <span>LIMITED EDITION</span>
            </motion.div>

            {/* Availability Info */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Availability</span>
                    <span className="text-white font-semibold">
                        {remaining} of {total} remaining
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - percentageRemaining}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6C4]"
                    />
                </div>

                {/* Urgency Message */}
                {percentageRemaining < 20 && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#D4AF37] text-xs mt-2 font-semibold"
                    >
                        ⚠️ Almost sold out! Only {remaining} left
                    </motion.p>
                )}
            </div>

            {/* Edition Features */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Total Supply</p>
                    <p className="text-white font-semibold">{total}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Sold</p>
                    <p className="text-white font-semibold">{total - remaining}</p>
                </div>
            </div>

            {/* Authenticity Features */}
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4">
                <h4 className="text-white font-semibold text-sm mb-3">
                    Authenticity Guaranteed
                </h4>
                <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex items-center gap-2">
                        <span className="text-[#2ECC71]">✓</span>
                        <span>Unique serial number</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-[#2ECC71]">✓</span>
                        <span>Certificate of authenticity</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-[#2ECC71]">✓</span>
                        <span>Platform verified</span>
                    </li>
                    {limitedEdition.blockchainVerification?.enabled && (
                        <li className="flex items-center gap-2">
                            <span className="text-[#2ECC71]">✓</span>
                            <span>Blockchain verified</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
