"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSequenceProps {
    imageSequenceSrc: string; // e.g. "/image-sequence-background"
    frameCount: number;
    className?: string;
    children?: React.ReactNode;
}

export default function ScrollSequence({
    imageSequenceSrc,
    frameCount,
    className,
    children,
}: ScrollSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const images: HTMLImageElement[] = [];
        const frame = { current: 0 };

        // Preload images
        let loadedCount = 0;
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `${imageSequenceSrc}/${String(i).padStart(5, "0")}.png`;
            img.onload = () => {
                loadedCount++;
                setLoadingProgress((loadedCount / frameCount) * 100);
                if (i === 1) render(); // Render first frame immediately
            };
            images.push(img);
        }

        const render = () => {
            // Clamp frame index
            let index = Math.round(frame.current);
            if (index < 0) index = 0;
            if (index >= images.length) index = images.length - 1;

            const img = images[index];

            if (img && img.complete && img.naturalWidth > 0) {
                // "Cover" fit logic
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        // GSAP Animation
        const st = ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
                frame.current = self.progress * (frameCount - 1);
                render();
            },
        });

        return () => {
            window.removeEventListener("resize", handleResize);
            st.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [frameCount, imageSequenceSrc]);

    return (
        <div ref={containerRef} className={cn("fixed inset-0 w-full h-full bg-black -z-10", className)}>
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover"
            />
            {/* Loading Indicator (optional, verified by debug) */}
            {loadingProgress < 100 && (
                <div className="absolute top-4 right-4 text-white text-xs z-50 opacity-50">
                    Loading: {Math.round(loadingProgress)}%
                </div>
            )}

            {/* Overlay Content */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {children}
            </div>
        </div>
    );
}
