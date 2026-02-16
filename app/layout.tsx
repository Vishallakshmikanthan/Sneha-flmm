import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { TrackingProvider } from "@/components/providers/TrackingProvider";
import { CookieConsent } from "@/components/privacy/CookieConsent";
import CustomCursor from "@/components/ui/CustomCursor";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import PageLoader from "@/components/ui/PageLoader";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Starry Night – Premium Art Marketplace",
    description: "Discover luxury digital art across Medieval, Renaissance, Modern, and Abstract styles. An immersive cinematic gallery experience.",
    keywords: ["art", "marketplace", "paintings", "sketches", "luxury", "digital art"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
            <body className="antialiased">
                <PageLoader />
                <CustomCursor />
                <ScrollProgress />
                <CookieConsent />
                <TrackingProvider>
                    <SmoothScrollProvider>
                        <Header />
                        {children}
                        <Footer />
                    </SmoothScrollProvider>
                </TrackingProvider>
            </body>
        </html>
    );
}
