/**
 * Custom GLSL Shaders for Cinematic Starfield System
 * Includes deep space background, enhanced stars, and nebula effects
 */

import * as THREE from 'three';

// ============================================================================
// DEEP SPACE BACKGROUND SHADER
// ============================================================================

export const deepSpaceVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const deepSpaceFragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 vUv;
varying vec3 vPosition;

// Perlin noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv;
    
    // Center coordinates
    vec2 center = uv - 0.5;
    float dist = length(center);
    
    // Swirling radial distortion
    float angle = atan(center.y, center.x);
    float swirl = sin(u_time * 0.05 + dist * 3.0) * 0.02;
    vec2 swirlUv = uv + vec2(cos(angle), sin(angle)) * swirl;
    
    // Mouse parallax effect (subtle)
    vec2 mouseOffset = (u_mouse - 0.5) * 0.02;
    swirlUv += mouseOffset * dist;
    
    // Multi-octave noise for texture
    float noise1 = snoise(swirlUv * 2.0 + u_time * 0.01);
    float noise2 = snoise(swirlUv * 4.0 - u_time * 0.015) * 0.5;
    float noise3 = snoise(swirlUv * 8.0 + u_time * 0.008) * 0.25;
    float combinedNoise = (noise1 + noise2 + noise3) * 0.5 + 0.5;
    
    // Gradient colors: midnight blue to deep indigo
    vec3 color1 = vec3(0.067, 0.106, 0.161); // #1B2735 - midnight
    vec3 color2 = vec3(0.043, 0.059, 0.102); // #0B0F1A - deep indigo
    vec3 color3 = vec3(0.059, 0.106, 0.180); // slightly lighter blue
    
    // Mix colors based on position and noise
    vec3 gradient = mix(color1, color2, uv.y);
    gradient = mix(gradient, color3, combinedNoise * 0.3);
    
    // Add subtle radial gradient from center
    float radialGrad = 1.0 - smoothstep(0.0, 1.0, dist * 1.2);
    gradient += color3 * radialGrad * 0.1;
    
    gl_FragColor = vec4(gradient, 1.0);
}
`;

// ============================================================================
// ENHANCED STAR SHADER
// ============================================================================

export const starVertexShader = `
attribute float size;
attribute float depth;
attribute float twinkleOffset;

uniform float u_time;
uniform float u_pixelRatio;
uniform float u_scrollDepth;

varying vec3 vColor;
varying float vTwinkle;

void main() {
    vColor = color;
    
    // Twinkle effect
    vTwinkle = sin(u_time * 0.002 + twinkleOffset) * 0.5 + 0.5;
    
    // Depth-based parallax
    vec3 pos = position;
    pos.z += u_scrollDepth * depth * 0.5;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size with twinkle and depth attenuation
    float finalSize = size * (0.7 + vTwinkle * 0.3);
    finalSize *= (1.0 - depth * 0.3); // Smaller when further
    
    gl_PointSize = finalSize * u_pixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const starFragmentShader = `
varying vec3 vColor;
varying float vTwinkle;

void main() {
    // Circular point with soft edges
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Soft falloff
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    alpha *= (0.6 + vTwinkle * 0.4);
    
    gl_FragColor = vec4(vColor, alpha);
}
`;

// ============================================================================
// NEBULA SWIRL SHADER
// ============================================================================

export const nebulaVertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const nebulaFragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_opacity;
uniform float u_scrollIntensity;

varying vec2 vUv;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv;
    
    // Rotating UV coordinates
    vec2 center = uv - 0.5;
    float angle = u_time * 0.03; // Slow rotation
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 rotatedUv = rotation * center + 0.5;
    
    // Multi-octave swirl pattern
    float scale = 3.0 + u_scrollIntensity * 0.5;
    float noise1 = snoise(rotatedUv * scale + u_time * 0.02);
    float noise2 = snoise(rotatedUv * scale * 2.0 - u_time * 0.015);
    float noise3 = snoise(rotatedUv * scale * 4.0 + u_time * 0.01);
    
    float swirl = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
    swirl = smoothstep(0.2, 0.8, swirl);
    
    // Nebula colors (purple/blue/gold tints)
    vec3 color1 = vec3(0.31, 0.44, 0.91); // Blue
    vec3 color2 = vec3(0.83, 0.69, 0.22); // Gold
    vec3 nebulaColor = mix(color1, color2, noise2 * 0.5 + 0.5);
    
    // Pulsing effect
    float pulse = sin(u_time * 0.5) * 0.1 + 0.9;
    
    float finalAlpha = swirl * u_opacity * pulse;
    
    gl_FragColor = vec4(nebulaColor, finalAlpha);
}
`;

// ============================================================================
// SHADER MATERIAL CREATORS
// ============================================================================

export const createDeepSpaceShader = (
    resolution: THREE.Vector2,
    mouse: THREE.Vector2
): THREE.ShaderMaterial => {
    return new THREE.ShaderMaterial({
        vertexShader: deepSpaceVertexShader,
        fragmentShader: deepSpaceFragmentShader,
        uniforms: {
            u_time: { value: 0 },
            u_resolution: { value: resolution },
            u_mouse: { value: mouse },
        },
        side: THREE.DoubleSide,
    });
};

export const createStarShader = (pixelRatio: number): THREE.ShaderMaterial => {
    return new THREE.ShaderMaterial({
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        uniforms: {
            u_time: { value: 0 },
            u_pixelRatio: { value: pixelRatio },
            u_scrollDepth: { value: 0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
    });
};

export const createNebulaShader = (
    resolution: THREE.Vector2
): THREE.ShaderMaterial => {
    return new THREE.ShaderMaterial({
        vertexShader: nebulaVertexShader,
        fragmentShader: nebulaFragmentShader,
        uniforms: {
            u_time: { value: 0 },
            u_resolution: { value: resolution },
            u_opacity: { value: 0.15 },
            u_scrollIntensity: { value: 0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
};
