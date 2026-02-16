/**
 * Post-processing pipeline for cinematic effects
 * Includes bloom, vignette, and film grain
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// ============================================================================
// CUSTOM VIGNETTE SHADER
// ============================================================================

const VignetteShader = {
    uniforms: {
        tDiffuse: { value: null },
        offset: { value: 0.8 },
        darkness: { value: 0.6 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float offset;
        uniform float darkness;
        varying vec2 vUv;
        
        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
            float vignette = 1.0 - dot(uv, uv);
            vignette = clamp(pow(vignette, darkness), 0.0, 1.0);
            gl_FragColor = vec4(texel.rgb * vignette, texel.a);
        }
    `,
};

// ============================================================================
// CUSTOM FILM GRAIN SHADER
// ============================================================================

const FilmGrainShader = {
    uniforms: {
        tDiffuse: { value: null },
        time: { value: 0.0 },
        noiseIntensity: { value: 0.05 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float noiseIntensity;
        varying vec2 vUv;
        
        float random(vec2 co) {
            return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            float noise = random(vUv + time) * noiseIntensity;
            gl_FragColor = vec4(texel.rgb + noise, texel.a);
        }
    `,
};

// ============================================================================
// POST-PROCESSING CONFIGURATION
// ============================================================================

export interface PostProcessingConfig {
    bloom: {
        strength: number;
        radius: number;
        threshold: number;
    };
    vignette: {
        offset: number;
        darkness: number;
    };
    filmGrain: {
        noiseIntensity: number;
    };
}

export const defaultPostProcessingConfig: PostProcessingConfig = {
    bloom: {
        strength: 0.4,
        radius: 0.6,
        threshold: 0.85,
    },
    vignette: {
        offset: 0.8,
        darkness: 0.6,
    },
    filmGrain: {
        noiseIntensity: 0.05,
    },
};

// ============================================================================
// COMPOSER SETUP
// ============================================================================

export const createPostProcessingComposer = (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    config: PostProcessingConfig = defaultPostProcessingConfig
): {
    composer: EffectComposer;
    bloomPass: UnrealBloomPass;
    vignettePass: ShaderPass;
    filmGrainPass: ShaderPass;
} => {
    // Create composer
    const composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Render Pass (base scene)
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // 2. Unreal Bloom Pass
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        config.bloom.strength,
        config.bloom.radius,
        config.bloom.threshold
    );
    composer.addPass(bloomPass);

    // 3. Film Grain Pass
    const filmGrainPass = new ShaderPass(FilmGrainShader);
    filmGrainPass.uniforms.noiseIntensity.value = config.filmGrain.noiseIntensity;
    composer.addPass(filmGrainPass);

    // 4. Vignette Pass (final)
    const vignettePass = new ShaderPass(VignetteShader);
    vignettePass.uniforms.offset.value = config.vignette.offset;
    vignettePass.uniforms.darkness.value = config.vignette.darkness;
    vignettePass.renderToScreen = true;
    composer.addPass(vignettePass);

    return { composer, bloomPass, vignettePass, filmGrainPass };
};

// ============================================================================
// UPDATE FUNCTIONS
// ============================================================================

export const updatePostProcessing = (
    filmGrainPass: ShaderPass,
    time: number
): void => {
    // Update film grain time for animated noise
    filmGrainPass.uniforms.time.value = time * 0.001;
};

export const resizePostProcessing = (
    composer: EffectComposer,
    bloomPass: UnrealBloomPass
): void => {
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update bloom resolution
    bloomPass.resolution.set(window.innerWidth, window.innerHeight);
};

// ============================================================================
// QUALITY PRESETS
// ============================================================================

export const PostProcessingPresets = {
    SUBTLE: {
        bloom: { strength: 0.3, radius: 0.5, threshold: 0.9 },
        vignette: { offset: 0.9, darkness: 0.5 },
        filmGrain: { noiseIntensity: 0.03 },
    },
    BALANCED: defaultPostProcessingConfig,
    CINEMATIC: {
        bloom: { strength: 0.5, radius: 0.7, threshold: 0.8 },
        vignette: { offset: 0.7, darkness: 0.7 },
        filmGrain: { noiseIntensity: 0.07 },
    },
} as const;
