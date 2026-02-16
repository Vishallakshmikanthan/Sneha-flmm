"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ParticleField() {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    useEffect(() => {
        const particleCount = 50;
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-gold/20 rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
