'use client';

import { MembershipTier, MEMBERSHIP_TIERS } from '@/types/membership';
import { getTierColor, getTierIcon } from '@/lib/membership-manager';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TierComparison() {
    const tiers: MembershipTier[] = ['bronze', 'silver', 'gold', 'platinum'];

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A] via-[#0F1B2E] to-[#0B0F1A]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Membership Tiers
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Choose the tier that matches your collecting journey
                    </p>
                </motion.div>

                {/* Tier Comparison Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tiers.map((tier, index) => {
                        const tierDef = MEMBERSHIP_TIERS[tier];
                        const tierColor = getTierColor(tier);
                        const tierIcon = getTierIcon(tier);
                        const isPopular = tier === 'gold';

                        return (
                            <motion.div
                                key={tier}
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Popular Badge */}
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                        <div className="px-4 py-1 bg-[#D4AF37] text-[#0B0F1A] text-xs font-bold rounded-full">
                                            MOST POPULAR
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`relative h-full rounded-2xl bg-gradient-to-br from-[#0F1B2E] to-[#0B0F1A] border p-6 transition-all duration-300 hover:scale-105 ${isPopular ? 'border-[#D4AF37]' : 'border-white/10'
                                        }`}
                                >
                                    {/* Glow Effect */}
                                    <div
                                        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl"
                                        style={{ background: tierColor }}
                                    />

                                    {/* Tier Header */}
                                    <div className="relative z-10 text-center mb-6">
                                        <div className="text-5xl mb-3">{tierIcon}</div>
                                        <h3 className="text-2xl font-serif text-white mb-2">
                                            {tierDef.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            {tierDef.description}
                                        </p>
                                        <div className="text-4xl font-bold text-white mb-1">
                                            ${tierDef.price}
                                        </div>
                                        <p className="text-sm text-gray-400">per month</p>
                                    </div>

                                    {/* Early Access Badge */}
                                    <div className="relative z-10 mb-6">
                                        <div
                                            className="px-3 py-2 rounded-lg text-center text-sm font-semibold"
                                            style={{
                                                background: `${tierColor}22`,
                                                border: `1px solid ${tierColor}44`,
                                                color: tierColor,
                                            }}
                                        >
                                            {tierDef.earlyAccessHours}h Early Access
                                        </div>
                                    </div>

                                    {/* Benefits List */}
                                    <div className="relative z-10 mb-6">
                                        <ul className="space-y-3">
                                            {tierDef.benefits.map((benefit, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2 text-sm text-gray-300"
                                                >
                                                    <span
                                                        className="mt-0.5 flex-shrink-0"
                                                        style={{ color: tierColor }}
                                                    >
                                                        ✓
                                                    </span>
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        href={`/membership/subscribe?tier=${tier}`}
                                        className="relative z-10 block w-full py-3 px-6 rounded-lg text-center font-semibold text-white transition-all duration-300 hover:scale-105"
                                        style={{
                                            background: isPopular
                                                ? `linear-gradient(135deg, ${tierColor}, ${tierColor}dd)`
                                                : `linear-gradient(135deg, ${tierColor}22, ${tierColor}44)`,
                                            border: `1px solid ${tierColor}66`,
                                        }}
                                    >
                                        Choose {tierDef.name.split(' ')[0]}
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Annual Discount Notice */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-gray-400">
                        💎 Save 16% with annual billing (2 months free)
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
