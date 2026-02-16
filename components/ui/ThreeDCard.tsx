"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

interface ThreeDCardProps {
    title: string;
    description?: string;
    imageSrc?: string;
    className?: string;
    onClick?: () => void;
}

export default function ThreeDCard({
    title,
    description,
    imageSrc,
    className = "",
    onClick,
}: ThreeDCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={`
                relative h-96 w-full rounded-xl bg-black/10 backdrop-blur-md
                border border-white/10 p-6 flex flex-col justify-end
                transition-all duration-300 ease-out
                hover:shadow-[0_0_30px_-5px_secondary] hover:border-gold/40
                group cursor-pointer overflow-hidden
                ${className}
            `}
        >
            {/* Background Image/Gradient */}
            <div
                style={{
                    transform: "translateZ(50px) scale(1.1)", // Parallax depth for background
                }}
                className="absolute inset-0 z-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            >
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-transparent" />
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div
                style={{
                    transform: "translateZ(80px)", // Pop out content
                }}
                className="relative z-10"
            >
                <div className="w-12 h-1 bg-gold mb-4 rounded-full" />
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-gray-300 line-clamp-2 max-w-[90%]">
                        {description}
                    </p>
                )}
            </div>

            {/* Shine effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent"
                style={{
                    transform: "translateZ(60px)",
                }}
            />
        </motion.div>
    );
}
