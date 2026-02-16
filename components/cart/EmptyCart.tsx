"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { useRouter } from "next/navigation";

export default function EmptyCart() {
    const router = useRouter();

    return (
        <main className="min-h-screen pt-32 pb-16 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-md"
            >
                {/* Empty Cart Icon */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="text-9xl mb-8"
                >
                    🛒
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-display mb-4 text-gold">
                    Your cart is empty
                </h1>
                <p className="text-text-muted mb-8">
                    Discover timeless masterpieces and add them to your collection
                </p>

                <MagneticButton
                    variant="primary"
                    size="lg"
                    onClick={() => router.push("/gallery")}
                >
                    Explore Gallery
                </MagneticButton>
            </motion.div>
        </main>
    );
}
