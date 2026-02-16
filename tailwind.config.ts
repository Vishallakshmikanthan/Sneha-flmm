import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Starry Night Premium Palette
                midnight: {
                    950: "#0B0F1A",
                    900: "#0F1B2E",
                    800: "#1B2735",
                    700: "#243447",
                },
                gold: {
                    DEFAULT: "#D4AF37",
                    light: "#F5E6C4",
                    dark: "#CBA135",
                },
                glow: {
                    blue: "#4F70E8",
                    cyan: "#6FA8FF",
                },
                text: {
                    primary: "#F8F8F8",
                    muted: "#B8C0CC",
                },
            },
            fontFamily: {
                display: ["var(--font-playfair)", "serif"],
                sans: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                grain: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                "gradient-swirl": "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
            },
            animation: {
                "float": "float 6s ease-in-out infinite",
                "shimmer": "shimmer 2s linear infinite",
                "glow": "glow 2s ease-in-out infinite alternate",
                "spin-slow": "spin 20s linear infinite",
                "fade-in": "fadeIn 0.5s ease-in",
                "slide-up": "slideUp 0.6s ease-out",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                glow: {
                    "0%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
                    "100%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(30px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
            spacing: {
                "128": "32rem",
                "144": "36rem",
            },
        },
    },
    plugins: [],
};

export default config;
