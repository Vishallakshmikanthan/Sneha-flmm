'use client';

import { Certificate } from '@/types/artist-ecosystem';
import { generateCertificateText } from '@/lib/utils/certificate-generator';
import { motion } from 'framer-motion';

interface CertificateOfAuthenticityProps {
    certificate: Certificate;
    showDownload?: boolean;
}

export default function CertificateOfAuthenticity({
    certificate,
    showDownload = true,
}: CertificateOfAuthenticityProps) {
    const handleDownload = () => {
        // In production, this would generate and download a PDF
        const text = generateCertificateText(certificate);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificate.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl p-8 max-w-2xl mx-auto"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-block px-4 py-2 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full mb-4">
                    <span className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">
                        Certificate of Authenticity
                    </span>
                </div>
                <h2 className="text-3xl font-serif text-white mb-2">
                    {certificate.artworkTitle}
                </h2>
                <p className="text-gray-400">Edition {certificate.serialNumber}</p>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Certificate ID</span>
                    <span className="text-white font-mono text-sm">{certificate.id}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Verification Code</span>
                    <span className="text-[#D4AF37] font-mono text-sm font-semibold">
                        {certificate.verificationCode}
                    </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Artist</span>
                    <span className="text-white">{certificate.artistName}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Acquired By</span>
                    <span className="text-white">{certificate.buyerName}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Issue Date</span>
                    <span className="text-white">
                        {certificate.issuedAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                </div>

                {certificate.blockchainHash && (
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-gray-400">Blockchain Hash</span>
                        <span className="text-[#2ECC71] font-mono text-xs truncate max-w-xs">
                            {certificate.blockchainHash}
                        </span>
                    </div>
                )}
            </div>

            {/* Authenticity Guarantee */}
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#0B0F1A] text-lg">✓</span>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2">Authenticity Guarantee</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            This certificate guarantees the authenticity and provenance of this limited
                            edition artwork. The artwork is verified and registered on the Starry Night
                            Premium Art Marketplace platform.
                        </p>
                    </div>
                </div>
            </div>

            {/* Verification Link */}
            <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-2">Verify this certificate online:</p>
                <a
                    href={`/verify/${certificate.verificationCode}`}
                    className="text-[#D4AF37] hover:text-[#F5E6C4] transition-colors text-sm font-mono"
                >
                    starrynight.art/verify/{certificate.verificationCode}
                </a>
            </div>

            {/* Download Button */}
            {showDownload && (
                <button
                    onClick={handleDownload}
                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#F5E6C4] text-[#0B0F1A] font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <span>📄</span>
                    <span>Download Certificate</span>
                </button>
            )}

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-500 text-xs">
                    Starry Night Premium Art Marketplace
                </p>
                <p className="text-gray-600 text-xs mt-1">Preserving Artistic Excellence</p>
            </div>
        </motion.div>
    );
}
