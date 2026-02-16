import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
    createScene,
    handleResize,
    disposeScene,
    createAnimationLoop,
} from '@/lib/three/scene-setup';

interface UseThreeSceneOptions {
    onAnimate?: (time: number, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void;
}

/**
 * Hook for managing Three.js scene lifecycle
 */
export const useThreeScene = (options: UseThreeSceneOptions = {}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
    } | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Create scene
        const { scene, camera, renderer } = createScene(canvasRef.current);
        sceneRef.current = { scene, camera, renderer };

        // Handle resize
        const onResize = handleResize(camera, renderer);
        window.addEventListener('resize', onResize);

        // Animation loop
        const stopAnimation = createAnimationLoop((time) => {
            if (options.onAnimate) {
                options.onAnimate(time, scene, camera);
            }
            renderer.render(scene, camera);
        });

        // Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            stopAnimation();
            disposeScene(scene, renderer);
            sceneRef.current = null;
        };
    }, []);

    return { canvasRef, sceneRef };
};
