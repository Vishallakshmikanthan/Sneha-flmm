import * as THREE from 'three';
import { THREE_CONFIG } from '@/lib/constants';

export interface SceneConfig {
    camera: {
        fov: number;
        near: number;
        far: number;
        position: [number, number, number];
    };
    renderer: {
        antialias: boolean;
        alpha: boolean;
    };
}

export const defaultSceneConfig: SceneConfig = {
    camera: {
        fov: THREE_CONFIG.CAMERA_FOV,
        near: THREE_CONFIG.CAMERA_NEAR,
        far: THREE_CONFIG.CAMERA_FAR,
        position: [0, 0, 5],
    },
    renderer: {
        antialias: true,
        alpha: false,
    },
};

/**
 * Create a Three.js scene with camera and renderer
 */
export const createScene = (
    canvas: HTMLCanvasElement,
    config: SceneConfig = defaultSceneConfig
) => {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        config.camera.fov,
        window.innerWidth / window.innerHeight,
        config.camera.near,
        config.camera.far
    );
    camera.position.set(...config.camera.position);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: config.renderer.antialias,
        alpha: config.renderer.alpha,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, THREE_CONFIG.MAX_PIXEL_RATIO));

    // Advanced rendering settings for cinematic quality
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Shadow configuration (soft PCF)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    return { scene, camera, renderer };
};

/**
 * Handle window resize for Three.js scene
 */
export const handleResize = (
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
) => {
    return () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
};

/**
 * Dispose of Three.js resources
 */
export const disposeScene = (
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer
) => {
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
            } else {
                object.material.dispose();
            }
        }
    });
    renderer.dispose();
    scene.clear();
};

/**
 * Create animation loop
 */
export const createAnimationLoop = (
    callback: (time: number) => void
) => {
    let animationId: number;

    const animate = (time: number) => {
        callback(time);
        animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
};
