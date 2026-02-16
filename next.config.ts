import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    experimental: {
        optimizePackageImports: ["three", "@react-three/fiber", "@react-three/drei"],
    },
};

export default nextConfig;
