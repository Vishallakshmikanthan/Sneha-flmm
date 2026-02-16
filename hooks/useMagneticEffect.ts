import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

interface UseMagneticEffectOptions {
    strength?: number;
    springConfig?: {
        stiffness?: number;
        damping?: number;
    };
}

/**
 * Hook for creating magnetic button effect
 * Button follows mouse cursor within its bounds
 */
export const useMagneticEffect = (
    options: UseMagneticEffectOptions = {}
) => {
    const { strength = 0.3, springConfig = {} } = options;
    const { stiffness = 150, damping = 15 } = springConfig;

    const elementRef = useRef<HTMLElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness, damping });
    const springY = useSpring(y, { stiffness, damping });

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;

            x.set(deltaX);
            y.set(deltaY);
        };

        const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength, x, y]);

    return { elementRef, x: springX, y: springY };
};
