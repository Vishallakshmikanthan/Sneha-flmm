/**
 * Advanced lighting system for cinematic atmosphere
 * Includes ambient, gold accent, and rim lighting
 */

import * as THREE from 'three';
import { COLORS } from '@/lib/constants';

// ============================================================================
// LIGHTING CONFIGURATION
// ============================================================================

export interface LightingConfig {
    ambient: {
        color: string;
        intensity: number;
    };
    goldAccent: {
        color: string;
        intensity: number;
        decay: number;
        distance: number;
        position: [number, number, number];
    };
    rimLight: {
        color: string;
        intensity: number;
        position: [number, number, number];
    };
}

export const defaultLightingConfig: LightingConfig = {
    ambient: {
        color: COLORS.MIDNIGHT[800], // #1B2735
        intensity: 0.3,
    },
    goldAccent: {
        color: COLORS.GOLD.DEFAULT, // #D4AF37
        intensity: 0.7,
        decay: 2, // Realistic decay
        distance: 100,
        position: [15, 10, 10],
    },
    rimLight: {
        color: COLORS.GLOW.CYAN, // #6FA8FF - soft blue
        intensity: 0.4,
        position: [-10, 5, -15],
    },
};

// ============================================================================
// LIGHT CREATION
// ============================================================================

export const createLightingSystem = (
    config: LightingConfig = defaultLightingConfig
): {
    ambientLight: THREE.AmbientLight;
    goldAccentLight: THREE.PointLight;
    rimLight: THREE.DirectionalLight;
    allLights: THREE.Light[];
} => {
    // Ambient Light - provides base illumination
    const ambientLight = new THREE.AmbientLight(
        config.ambient.color,
        config.ambient.intensity
    );

    // Gold Accent Light - warm point light for premium feel
    const goldAccentLight = new THREE.PointLight(
        config.goldAccent.color,
        config.goldAccent.intensity,
        config.goldAccent.distance,
        config.goldAccent.decay
    );
    goldAccentLight.position.set(...config.goldAccent.position);

    // Rim Light - directional light for edge definition
    const rimLight = new THREE.DirectionalLight(
        config.rimLight.color,
        config.rimLight.intensity
    );
    rimLight.position.set(...config.rimLight.position);

    const allLights = [ambientLight, goldAccentLight, rimLight];

    return { ambientLight, goldAccentLight, rimLight, allLights };
};

// ============================================================================
// LIGHT ANIMATION
// ============================================================================

export const animateLights = (
    goldAccentLight: THREE.PointLight,
    rimLight: THREE.DirectionalLight,
    time: number
): void => {
    // Subtle movement for gold accent light
    const radius = 15;
    goldAccentLight.position.x = Math.cos(time * 0.0003) * radius;
    goldAccentLight.position.z = Math.sin(time * 0.0003) * radius;
    goldAccentLight.position.y = 10 + Math.sin(time * 0.0005) * 3;

    // Gentle pulsing intensity
    const baseLightIntensity = 0.7;
    goldAccentLight.intensity =
        baseLightIntensity + Math.sin(time * 0.001) * 0.1;

    // Subtle rim light rotation
    const rimRadius = 15;
    rimLight.position.x = Math.sin(time * 0.0002) * rimRadius;
    rimLight.position.z = Math.cos(time * 0.0002) * rimRadius;
};

// ============================================================================
// HELPER VISUALIZATIONS (for debugging)
// ============================================================================

export const addLightHelpers = (
    scene: THREE.Scene,
    goldAccentLight: THREE.PointLight,
    rimLight: THREE.DirectionalLight
): THREE.Object3D[] => {
    const helpers: THREE.Object3D[] = [];

    // Point light helper
    const pointLightHelper = new THREE.PointLightHelper(goldAccentLight, 1);
    scene.add(pointLightHelper);
    helpers.push(pointLightHelper);

    // Directional light helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(
        rimLight,
        5
    );
    scene.add(directionalLightHelper);
    helpers.push(directionalLightHelper);

    return helpers;
};

export const removeLightHelpers = (
    scene: THREE.Scene,
    helpers: THREE.Object3D[]
): void => {
    helpers.forEach((helper) => {
        scene.remove(helper);
    });
};
