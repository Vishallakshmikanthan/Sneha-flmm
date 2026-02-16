"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-glow-blue z-[100] origin-left"
                style={{
                    scaleX: scrollProgress / 100,
                }}
                initial={{ scaleX: 0 }}
            />

            {/* Star Trail Indicator */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
                {[0, 1, 2, 3, 4].map((index) => {
                    const sectionProgress = (index / 4) * 100;
                    const isActive = scrollProgress >= sectionProgress;
                    const isPassed = scrollProgress > sectionProgress + 20;

                    return (
                        <motion.div
                            key={index}
                            className="relative"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <motion.div
                                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isPassed
                                        ? "bg-gold border-gold scale-75"
                                        : isActive
                                            ? "bg-gold border-gold scale-100"
                                            : "bg-transparent border-gold/30 scale-75"
                                    }`}
                                animate={{
                                    boxShadow: isActive
                                        ? "0 0 20px rgba(212, 175, 55, 0.6)"
                                        : "0 0 0px rgba(212, 175, 55, 0)",
                                }}
                            />
                            {isActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-gold"
                                    initial={{ scale: 1, opacity: 0.5 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                    }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}
