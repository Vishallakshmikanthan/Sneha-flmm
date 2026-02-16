import * as THREE from 'three';
import { THREE_CONFIG, COLORS } from '@/lib/constants';

/**
 * Create an optimized star system with instanced geometry and custom shaders
 */
export const createStarSystem = (count: number = 5000) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const depths = new Float32Array(count);
    const twinkleOffsets = new Float32Array(count);

    // Color palette
    const goldColor = new THREE.Color(COLORS.GOLD.DEFAULT);
    const blueColor = new THREE.Color(COLORS.GLOW.CYAN);
    const whiteColor = new THREE.Color(0xffffff);
    const lightGoldColor = new THREE.Color(COLORS.GOLD.LIGHT);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Position stars in a spherical distribution
        const radius = Math.random() * 60 + 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi) - 35;

        // Color distribution: 10% gold, 5% light gold, 10% blue, 75% white
        const colorChoice = Math.random();
        const color =
            colorChoice < 0.1
                ? goldColor
                : colorChoice < 0.15
                    ? lightGoldColor
                    : colorChoice < 0.25
                        ? blueColor
                        : whiteColor;

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Size variation
        sizes[i] = Math.random() * 4 + 0.5;

        // Depth for parallax (0 = near, 1 = far)
        depths[i] = Math.random();

        // Random twinkle offset for variation
        twinkleOffsets[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('depth', new THREE.BufferAttribute(depths, 1));
    geometry.setAttribute('twinkleOffset', new THREE.BufferAttribute(twinkleOffsets, 1));

    return geometry;
};

/**
 * Create particle streak system for motion effects
 */
export const createParticleStreaks = (count: number = 50): THREE.LineSegments => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 6); // 2 points per line
    const colors = new Float32Array(count * 6);
    const velocities: number[] = [];

    const streakColor = new THREE.Color(COLORS.GLOW.CYAN);
    const fadeColor = new THREE.Color(COLORS.GLOW.CYAN);
    fadeColor.multiplyScalar(0.3);

    for (let i = 0; i < count; i++) {
        const i6 = i * 6;

        // Random position in space
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 50 - 20;

        // Start point
        positions[i6] = x;
        positions[i6 + 1] = y;
        positions[i6 + 2] = z;

        // End point (short vertical line)
        const length = Math.random() * 2 + 0.5;
        positions[i6 + 3] = x;
        positions[i6 + 4] = y - length;
        positions[i6 + 5] = z;

        // Colors (gradient from bright to fade)
        colors[i6] = streakColor.r;
        colors[i6 + 1] = streakColor.g;
        colors[i6 + 2] = streakColor.b;

        colors[i6 + 3] = fadeColor.r;
        colors[i6 + 4] = fadeColor.g;
        colors[i6 + 5] = fadeColor.b;

        // Random velocity for drift
        velocities.push(Math.random() * 0.02 + 0.01);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
    });

    const streaks = new THREE.LineSegments(geometry, material);
    (streaks as any).velocities = velocities; // Store velocities for animation

    return streaks;
};

/**
 * Animate particle streaks with vertical drift
 */
export const animateParticleStreaks = (
    streaks: THREE.LineSegments,
    scrollSpeed: number = 0
): void => {
    const positions = streaks.geometry.attributes.position.array as Float32Array;
    const velocities = (streaks as any).velocities as number[];
    const count = velocities.length;

    for (let i = 0; i < count; i++) {
        const i6 = i * 6;

        // Move both points down
        const speed = velocities[i] * (1 + scrollSpeed * 2);
        positions[i6 + 1] -= speed;
        positions[i6 + 4] -= speed;

        // Reset if too far down
        if (positions[i6 + 1] < -50) {
            const resetY = 50;
            const offset = positions[i6 + 4] - positions[i6 + 1];
            positions[i6 + 1] = resetY;
            positions[i6 + 4] = resetY + offset;

            // Randomize X and Z
            positions[i6] = (Math.random() - 0.5) * 100;
            positions[i6 + 2] = (Math.random() - 0.5) * 50 - 20;
            positions[i6 + 3] = positions[i6];
            positions[i6 + 5] = positions[i6 + 2];
        }
    }

    streaks.geometry.attributes.position.needsUpdate = true;
};

/**
 * Animate star system with subtle rotation
 */
export const animateStarSystem = (
    stars: THREE.Points,
    time: number
) => {
    // Slow rotation
    stars.rotation.y = time * 0.0001;
    stars.rotation.x = Math.sin(time * 0.0002) * 0.05;
};

/**
 * Create point lights for star glow effect (legacy - now using shader-based approach)
 */
export const createStarLights = () => {
    const lights: THREE.PointLight[] = [];

    // Gold light
    const goldLight = new THREE.PointLight(COLORS.GOLD.DEFAULT, 1, 100);
    goldLight.position.set(10, 10, 10);
    lights.push(goldLight);

    // Blue light
    const blueLight = new THREE.PointLight(COLORS.GLOW.BLUE, 0.8, 100);
    blueLight.position.set(-10, -10, 10);
    lights.push(blueLight);

    return lights;
};

