"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-midnight-950"
                >
                    <div className="relative">
                        {/* Animated logo/title */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <motion.h1
                                className="text-6xl md:text-8xl font-display text-gold mb-4"
                                animate={{
                                    textShadow: [
                                        "0 0 20px rgba(212, 175, 55, 0.3)",
                                        "0 0 40px rgba(212, 175, 55, 0.6)",
                                        "0 0 20px rgba(212, 175, 55, 0.3)",
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                Starry Night
                            </motion.h1>
                            <p className="text-text-muted text-lg">Loading masterpieces...</p>
                        </motion.div>

                        {/* Circular progress */}
                        <div className="relative w-32 h-32 mx-auto">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="rgba(212, 175, 55, 0.2)"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <motion.circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="rgba(212, 175, 55, 1)"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: progress / 100 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))",
                                    }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-semibold text-gold">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>

                        {/* Orbiting stars */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-3 h-3 bg-gold rounded-full"
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.4,
                                        ease: "linear",
                                    }}
                                    style={{
                                        offsetPath: "path('M 0,0 m -80,0 a 80,80 0 1,0 160,0 a 80,80 0 1,0 -160,0')",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Grain overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-grain" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
