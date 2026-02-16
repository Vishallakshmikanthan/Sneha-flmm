'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecommendationStore } from '@/lib/store/recommendationStore';

// ============================================================================
// Cookie Consent Banner Component
// ============================================================================

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const privacySettings = useRecommendationStore((state) => state.privacySettings);
    const setPrivacySettings = useRecommendationStore((state) => state.setPrivacySettings);

    useEffect(() => {
        // Show banner if consent hasn't been given
        if (!privacySettings.consentGivenAt) {
            // Delay showing banner for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [privacySettings.consentGivenAt]);

    const handleAcceptAll = () => {
        setPrivacySettings({
            personalizationEnabled: true,
            trackingEnabled: true,
            analyticsEnabled: true,
            consentGivenAt: Date.now(),
        });
        setIsVisible(false);
    };

    const handleAcceptEssential = () => {
        setPrivacySettings({
            personalizationEnabled: false,
            trackingEnabled: false,
            analyticsEnabled: false,
            consentGivenAt: Date.now(),
        });
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed bottom-0 left-0 right-0 z-[10000] p-6"
                >
                    <div className="max-w-4xl mx-auto bg-midnight-900/95 backdrop-blur-xl border border-midnight-700 rounded-2xl p-6 shadow-2xl">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="font-playfair text-xl text-white mb-2">
                                    Your Privacy Matters
                                </h3>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    We use cookies and tracking to personalize your art browsing
                                    experience, show you recommendations based on your taste, and
                                    improve our services. You can choose to accept all or only
                                    essential cookies.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <button
                                    onClick={handleAcceptEssential}
                                    className="px-6 py-3 bg-midnight-800 hover:bg-midnight-700 text-white rounded-lg transition-colors duration-300 border border-midnight-700 hover:border-midnight-600 text-sm font-medium"
                                >
                                    Essential Only
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-6 py-3 bg-gold hover:bg-gold-dark text-midnight-950 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gold/20 text-sm font-semibold"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>

                        {/* Privacy Policy Link */}
                        <div className="mt-4 pt-4 border-t border-midnight-800">
                            <p className="text-xs text-text-muted">
                                By continuing to use our site, you agree to our use of cookies.{' '}
                                <a
                                    href="/privacy"
                                    className="text-gold hover:text-gold-light underline"
                                >
                                    Learn more about our privacy policy
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
