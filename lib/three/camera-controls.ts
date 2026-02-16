/**
 * Cinematic camera system with intro animation and scroll controls
 * Includes mouse parallax and smooth damping
 */

import * as THREE from 'three';

// ============================================================================
// CAMERA CONFIGURATION
// ============================================================================

export interface CameraConfig {
    fov: number;
    near: number;
    far: number;
    initialPosition: [number, number, number];
    introAnimation: {
        enabled: boolean;
        duration: number; // milliseconds
        targetZ: number;
    };
    parallax: {
        enabled: boolean;
        intensity: number;
    };
    scroll: {
        enabled: boolean;
        zoomIntensity: number;
        maxDepth: number;
    };
    damping: number; // 0-1, higher = smoother
}

export const defaultCameraConfig: CameraConfig = {
    fov: 70,
    near: 0.1,
    far: 1000,
    initialPosition: [0, 0, 10],
    introAnimation: {
        enabled: true,
        duration: 2000,
        targetZ: 5,
    },
    parallax: {
        enabled: true,
        intensity: 0.5,
    },
    scroll: {
        enabled: true,
        zoomIntensity: 0.02,
        maxDepth: 15,
    },
    damping: 0.1,
};

// ============================================================================
// CAMERA STATE
// ============================================================================

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private config: CameraConfig;
    private targetPosition: THREE.Vector3;
    private targetRotation: THREE.Euler;
    private mousePosition: THREE.Vector2;
    private scrollDepth: number;
    private introStartTime: number | null;

    constructor(camera: THREE.PerspectiveCamera, config: CameraConfig = defaultCameraConfig) {
        this.camera = camera;
        this.config = config;
        this.targetPosition = new THREE.Vector3(...config.initialPosition);
        this.targetRotation = new THREE.Euler(0, 0, 0);
        this.mousePosition = new THREE.Vector2(0, 0);
        this.scrollDepth = 0;
        this.introStartTime = config.introAnimation.enabled ? Date.now() : null;

        // Set initial camera position
        this.camera.position.set(...config.initialPosition);
    }

    // ========================================================================
    // INTRO ANIMATION
    // ========================================================================

    private updateIntroAnimation(time: number): boolean {
        if (!this.introStartTime) return false;

        const elapsed = time - this.introStartTime;
        const progress = Math.min(elapsed / this.config.introAnimation.duration, 1);

        if (progress >= 1) {
            this.introStartTime = null;
            return false;
        }

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);

        // Animate Z position
        const startZ = this.config.initialPosition[2];
        const targetZ = this.config.introAnimation.targetZ;
        this.camera.position.z = startZ + (targetZ - startZ) * eased;

        return true;
    }

    // ========================================================================
    // MOUSE PARALLAX
    // ========================================================================

    public setMousePosition(x: number, y: number): void {
        // Normalize to -1 to 1
        this.mousePosition.x = (x / window.innerWidth) * 2 - 1;
        this.mousePosition.y = -(y / window.innerHeight) * 2 + 1;
    }

    private updateParallax(): void {
        if (!this.config.parallax.enabled) return;

        const intensity = this.config.parallax.intensity;

        // Subtle tilt based on mouse position
        this.targetRotation.y = this.mousePosition.x * 0.05 * intensity;
        this.targetRotation.x = this.mousePosition.y * 0.05 * intensity;
    }

    // ========================================================================
    // SCROLL CONTROLS
    // ========================================================================

    public setScrollDepth(scrollY: number): void {
        if (!this.config.scroll.enabled) return;

        // Normalize scroll to depth value
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

        this.scrollDepth = scrollProgress * this.config.scroll.maxDepth;
    }

    private updateScrollZoom(): void {
        if (!this.config.scroll.enabled) return;

        // Adjust camera Z based on scroll
        const baseZ = this.config.introAnimation.targetZ;
        this.targetPosition.z = baseZ - this.scrollDepth * this.config.scroll.zoomIntensity;
    }

    // ========================================================================
    // UPDATE LOOP
    // ========================================================================

    public update(time: number): void {
        // Check if intro animation is active
        const isIntroActive = this.updateIntroAnimation(time);

        // Only apply other controls after intro completes
        if (!isIntroActive) {
            this.updateParallax();
            this.updateScrollZoom();

            // Smooth damping for position
            this.camera.position.lerp(this.targetPosition, this.config.damping);

            // Smooth damping for rotation
            this.camera.rotation.x += (this.targetRotation.x - this.camera.rotation.x) * this.config.damping;
            this.camera.rotation.y += (this.targetRotation.y - this.camera.rotation.y) * this.config.damping;
        }
    }

    // ========================================================================
    // GETTERS
    // ========================================================================

    public getScrollDepth(): number {
        return this.scrollDepth;
    }

    public getMousePosition(): THREE.Vector2 {
        return this.mousePosition;
    }

    public isIntroComplete(): boolean {
        return this.introStartTime === null;
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const createCinematicCamera = (
    config: CameraConfig = defaultCameraConfig
): { camera: THREE.PerspectiveCamera; controller: CameraController } => {
    const camera = new THREE.PerspectiveCamera(
        config.fov,
        window.innerWidth / window.innerHeight,
        config.near,
        config.far
    );

    const controller = new CameraController(camera, config);

    return { camera, controller };
};

export const handleCameraResize = (camera: THREE.PerspectiveCamera): void => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
