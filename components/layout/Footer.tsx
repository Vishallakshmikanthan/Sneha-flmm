import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-16 px-4 md:px-8 border-t border-gold/20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-display text-gold mb-4">
                            Starry Night
                        </h3>
                        <p className="text-text-muted max-w-md mb-6">
                            Discover timeless masterpieces across Medieval, Renaissance, Modern, and Abstract eras.
                            An immersive cinematic gallery experience.
                        </p>
                        <div className="flex gap-4">
                            {["Twitter", "Instagram", "Facebook"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold hover:bg-gold hover:text-midnight-950 transition-all duration-300"
                                >
                                    <span className="sr-only">{social}</span>
                                    <span className="text-sm">•</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-text-primary mb-4">
                            Explore
                        </h4>
                        <ul className="space-y-2">
                            {["Gallery", "Artists", "Categories", "About"].map((link) => (
                                <li key={link}>
                                    <Link
                                        href={`/${link.toLowerCase()}`}
                                        className="text-text-muted hover:text-gold transition-colors duration-300"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold text-text-primary mb-4">
                            Stay Updated
                        </h4>
                        <p className="text-text-muted text-sm mb-4">
                            Subscribe to our newsletter for new arrivals and exclusive offers.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 rounded-full glass border border-gold/20 focus:border-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                            />
                            <button className="px-6 py-2 bg-gold text-midnight-950 rounded-full font-semibold hover:bg-gold-light transition-colors duration-300">
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
                    <p>© {currentYear} Starry Night. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-gold transition-colors duration-300">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-gold transition-colors duration-300">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
