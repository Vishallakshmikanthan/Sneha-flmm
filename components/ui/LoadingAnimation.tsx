"use client";

import { motion } from "framer-motion";

export default function LoadingAnimation() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-midnight-950">
            <div className="relative">
                {/* Animated stars */}
                <div className="flex gap-4">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="w-4 h-4 rounded-full bg-gold"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: index * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Loading text */}
                <motion.p
                    className="mt-8 text-text-muted text-center"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    Loading...
                </motion.p>
            </div>

            {/* Grain overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-grain" />
        </div>
    );
}
