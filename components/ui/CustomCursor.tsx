"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;

        if (!cursor || !cursorDot) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let dotX = 0;
        let dotY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const animate = () => {
            // Smooth follow with lerp
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            dotX += (mouseX - dotX) * 0.15;
            dotY += (mouseY - dotY) * 0.15;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;

            requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        const animationId = requestAnimationFrame(animate);

        // Add custom cursor class to body
        document.body.classList.add("custom-cursor-active");

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationId);
            document.body.classList.remove("custom-cursor-active");
        };
    }, []);

    return (
        <>
            {/* Outer glow */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[10000] mix-blend-screen"
                style={{
                    marginLeft: "-16px",
                    marginTop: "-16px",
                }}
            >
                <div className="w-full h-full rounded-full bg-gold/20 blur-md" />
            </motion.div>

            {/* Inner dot */}
            <motion.div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[10001]"
                style={{
                    marginLeft: "-4px",
                    marginTop: "-4px",
                }}
            >
                <div className="w-full h-full rounded-full bg-gold" />
            </motion.div>
        </>
    );
}
