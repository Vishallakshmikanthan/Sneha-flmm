"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import HeroScene from "./HeroScene";
import { Loader } from "@react-three/drei";

export default function ThreeHero() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false }}
            >
                <Suspense fallback={null}>
                    <HeroScene />
                </Suspense>
            </Canvas>
            <Loader containerStyles={{ background: "#0B0F1A" }} />
        </div>
    );
}
