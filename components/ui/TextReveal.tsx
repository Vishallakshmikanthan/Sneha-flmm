"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
}

export default function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
    const elementRef = useRef<HTMLHeadingElement>(null);

    const words = children.split(" ");

    return (
        <h2 ref={elementRef} className={cn("flex flex-wrap justify-center overflow-hidden", className)}>
            {words.map((word, i) => (
                <span key={i} className="relative mx-1 lg:mx-2 overflow-hidden inline-block">
                    <motion.span
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{
                            duration: 0.8,
                            ease: [0.33, 1, 0.68, 1],
                            delay: delay + i * 0.03,
                        }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </h2>
    );
}

export function HeroTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.h1
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn("text-center", className)}
        >
            {children}
        </motion.h1>
    );
}
