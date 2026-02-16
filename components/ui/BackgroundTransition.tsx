"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function BackgroundTransition() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress (0 to 1)
            const progress = Math.min(scrollY / (windowHeight * 3), 1);

            // Transition from midnight blue to darker tones
            const hue = 220 + progress * 20; // 220 (blue) to 240 (deeper blue)
            const saturation = 40 - progress * 10; // 40% to 30%
            const lightness = 8 - progress * 3; // 8% to 5%

            document.body.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div ref={sectionRef} className="fixed inset-0 -z-20 pointer-events-none">
            {/* Gradient overlays that fade in/out on scroll */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-glow-blue/5 to-transparent"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
