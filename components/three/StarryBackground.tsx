/* eslint-disable */
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
    createDeepSpaceShader,
    createStarShader,
    createNebulaShader,
} from "@/lib/three/shaders";
import {
    createPostProcessingComposer,
    updatePostProcessing,
    resizePostProcessing,
} from "@/lib/three/post-processing";
import {
    createLightingSystem,
    animateLights,
} from "@/lib/three/lighting";
import {
    createCinematicCamera,
    handleCameraResize,
} from "@/lib/three/camera-controls";
import {
    createStarSystem,
    createParticleStreaks,
    animateStarSystem,
    animateParticleStreaks,
} from "@/lib/three/star-system";

export default function StarryBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        composer: any;
        cameraController: any;
        stars: THREE.Points;
        streaks: THREE.LineSegments;
        deepSpaceMaterial: THREE.ShaderMaterial;
        nebulaMaterial: THREE.ShaderMaterial;
        starMaterial: THREE.ShaderMaterial;
        filmGrainPass: any;
        goldAccentLight: THREE.PointLight;
        rimLight: THREE.DirectionalLight;
        animationId: number;
    } | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // ====================================================================
        // SCENE SETUP
        // ====================================================================

        const scene = new THREE.Scene();

        // Create cinematic camera with controller
        const { camera, controller: cameraController } = createCinematicCamera();

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: false,
            antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // ====================================================================
        // LAYER 1: DEEP SPACE BACKGROUND
        // ====================================================================

        const deepSpaceGeometry = new THREE.PlaneGeometry(200, 200);
        const deepSpaceMaterial = createDeepSpaceShader(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            new THREE.Vector2(0.5, 0.5)
        );
        const deepSpacePlane = new THREE.Mesh(deepSpaceGeometry, deepSpaceMaterial);
        deepSpacePlane.position.z = -50;
        deepSpacePlane.renderOrder = 0;
        scene.add(deepSpacePlane);

        // ====================================================================
        // LAYER 2: ANIMATED STARFIELD
        // ====================================================================

        const starGeometry = createStarSystem(5000);
        const starMaterial = createStarShader(Math.min(window.devicePixelRatio, 2));
        const stars = new THREE.Points(starGeometry, starMaterial);
        stars.renderOrder = 1;
        scene.add(stars);

        // ====================================================================
        // LAYER 3: NEBULA SWIRL
        // ====================================================================

        const nebulaGeometry = new THREE.PlaneGeometry(150, 150);
        const nebulaMaterial = createNebulaShader(
            new THREE.Vector2(window.innerWidth, window.innerHeight)
        );
        const nebulaPlane = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebulaPlane.position.z = -30;
        nebulaPlane.renderOrder = 2;
        scene.add(nebulaPlane);

        // ====================================================================
        // LAYER 4: PARTICLE STREAKS
        // ====================================================================

        const streaks = createParticleStreaks(50);
        streaks.renderOrder = 3;
        scene.add(streaks);

        // ====================================================================
        // LIGHTING SYSTEM
        // ====================================================================

        const { goldAccentLight, rimLight, allLights } =
            createLightingSystem();
        allLights.forEach((light) => scene.add(light));

        // ====================================================================
        // POST-PROCESSING
        // ====================================================================

        const { composer, bloomPass, filmGrainPass } =
            createPostProcessingComposer(renderer, scene, camera);

        // ====================================================================
        // INTERACTION HANDLERS
        // ====================================================================

        const handleMouseMove = (event: MouseEvent) => {
            cameraController.setMousePosition(event.clientX, event.clientY);

            // Update deep space shader mouse uniform
            const mouseX = event.clientX / window.innerWidth;
            const mouseY = 1.0 - event.clientY / window.innerHeight;
            deepSpaceMaterial.uniforms.u_mouse.value.set(mouseX, mouseY);
        };

        const handleScroll = () => {
            const scrollY = window.scrollY;
            cameraController.setScrollDepth(scrollY);

            // Update nebula scroll intensity
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
            nebulaMaterial.uniforms.u_scrollIntensity.value = scrollProgress;

            // Update star opacity based on scroll
            const scrollFade = 1.0 - scrollProgress * 0.3;
            starMaterial.uniforms.u_scrollDepth.value = scrollProgress * 5;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll, { passive: true });

        // ====================================================================
        // RESIZE HANDLER
        // ====================================================================

        const handleResize = () => {
            handleCameraResize(camera);
            renderer.setSize(window.innerWidth, window.innerHeight);
            resizePostProcessing(composer, bloomPass);

            // Update shader resolutions
            deepSpaceMaterial.uniforms.u_resolution.value.set(
                window.innerWidth,
                window.innerHeight
            );
            nebulaMaterial.uniforms.u_resolution.value.set(
                window.innerWidth,
                window.innerHeight
            );
        };

        window.addEventListener("resize", handleResize);

        // ====================================================================
        // ANIMATION LOOP
        // ====================================================================

        let time = 0;
        const animate = () => {
            time += 16; // ~60fps

            // Update camera controller
            cameraController.update(time);

            // Update shader uniforms
            deepSpaceMaterial.uniforms.u_time.value = time * 0.001;
            starMaterial.uniforms.u_time.value = time;
            nebulaMaterial.uniforms.u_time.value = time * 0.001;

            // Animate systems
            animateStarSystem(stars, time);
            const scrollSpeed = cameraController.getScrollDepth() * 0.1;
            animateParticleStreaks(streaks, scrollSpeed);
            animateLights(goldAccentLight, rimLight, time);

            // Update post-processing
            updatePostProcessing(filmGrainPass, time);

            // Render with post-processing
            composer.render();

            sceneRef.current!.animationId = requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        // Store refs
        sceneRef.current = {
            scene,
            camera,
            renderer,
            composer,
            cameraController,
            stars,
            streaks,
            deepSpaceMaterial,
            nebulaMaterial,
            starMaterial,
            filmGrainPass,
            goldAccentLight,
            rimLight,
            animationId,
        };

        // ====================================================================
        // CLEANUP
        // ====================================================================

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);

            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.animationId);

                // Dispose geometries and materials
                deepSpaceGeometry.dispose();
                deepSpaceMaterial.dispose();
                starGeometry.dispose();
                starMaterial.dispose();
                nebulaGeometry.dispose();
                nebulaMaterial.dispose();
                streaks.geometry.dispose();
                (streaks.material as THREE.Material).dispose();

                // Dispose renderer and composer
                sceneRef.current.renderer.dispose();
                sceneRef.current.composer.dispose();
                sceneRef.current.scene.clear();
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
        />
    );
}
