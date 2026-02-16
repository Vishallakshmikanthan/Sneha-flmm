"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;

    strength?: number; // How strong the magnetic pull is (default: 0.5)
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
}

export default function MagneticButton({
    children,
    className = "",
    onClick,

    strength = 0.5,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    variant = "primary",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    size = "md",
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        const text = textRef.current;
        if (!button || !text) return;

        const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = button.getBoundingClientRect();

            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            // Move button
            xTo(x * strength);
            yTo(y * strength);

            // Move text slightly more for depth effect
            textXTo(x * (strength * 1.2));
            textYTo(y * (strength * 1.2));
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
            textXTo(0);
            textYTo(0);
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            button.removeEventListener("mousemove", handleMouseMove);
            button.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className={`
                relative inline-flex items-center justify-center
                px-8 py-4 rounded-full
                bg-gold/10 backdrop-blur-sm
                border border-gold/30
                text-gold font-medium tracking-wide
                uppercase transition-colors duration-300
                hover:bg-gold/20 hover:border-gold/60
                group overflow-hidden
                ${className}
            `}
        >
            <div className="absolute inset-0 rounded-full bg-gold/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span ref={textRef} className="relative z-10 pointer-events-none">
                {children}
            </span>
        </button>
    );
}
