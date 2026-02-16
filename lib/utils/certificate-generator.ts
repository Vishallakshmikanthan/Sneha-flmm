import { Certificate } from '@/types/artist-ecosystem';

/**
 * Generate a unique certificate ID
 */
export function generateCertificateId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `CERT-${timestamp}-${random}`;
}

/**
 * Generate a verification code for certificate authenticity
 */
export function generateVerificationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking chars
    let code = '';

    for (let i = 0; i < 12; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
        if ((i + 1) % 4 === 0 && i < 11) {
            code += '-';
        }
    }

    return code;
}

/**
 * Create certificate data for a limited edition artwork
 */
export function createCertificate(data: {
    artworkId: string;
    artworkTitle: string;
    serialNumber: number;
    artistId: string;
    artistName: string;
    buyerId: string;
    buyerName: string;
}): Omit<Certificate, 'certificateUrl'> {
    return {
        id: generateCertificateId(),
        artworkId: data.artworkId,
        serialNumber: data.serialNumber,
        artistId: data.artistId,
        artistName: data.artistName,
        artworkTitle: data.artworkTitle,
        buyerId: data.buyerId,
        buyerName: data.buyerName,
        issuedAt: new Date(),
        verificationCode: generateVerificationCode(),
    };
}

/**
 * Validate verification code format
 */
export function validateVerificationCode(code: string): boolean {
    const pattern = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
    return pattern.test(code);
}

/**
 * Generate certificate text content
 */
export function generateCertificateText(certificate: Certificate): string {
    return `
CERTIFICATE OF AUTHENTICITY

Certificate ID: ${certificate.id}
Verification Code: ${certificate.verificationCode}

This certifies that the artwork:

"${certificate.artworkTitle}"
Edition ${certificate.serialNumber}

Created by: ${certificate.artistName}
Artist ID: ${certificate.artistId}

Has been acquired by: ${certificate.buyerName}
Buyer ID: ${certificate.buyerId}

Issue Date: ${certificate.issuedAt.toLocaleDateString()}

This certificate guarantees the authenticity and provenance of this limited edition artwork.
The artwork is verified and registered on the Starry Night Premium Art Marketplace platform.

To verify this certificate, visit:
https://starrynight.art/verify/${certificate.verificationCode}

${certificate.blockchainHash ? `Blockchain Hash: ${certificate.blockchainHash}` : ''}

---
Starry Night Premium Art Marketplace
Preserving Artistic Excellence
  `.trim();
}

/**
 * Format certificate for PDF generation
 * Returns structured data that can be used with a PDF library
 */
export function formatCertificateForPDF(certificate: Certificate) {
    return {
        title: 'Certificate of Authenticity',
        sections: [
            {
                label: 'Certificate ID',
                value: certificate.id,
            },
            {
                label: 'Verification Code',
                value: certificate.verificationCode,
                highlight: true,
            },
            {
                label: 'Artwork',
                value: certificate.artworkTitle,
                style: 'large',
            },
            {
                label: 'Edition',
                value: `Edition ${certificate.serialNumber}`,
            },
            {
                label: 'Artist',
                value: certificate.artistName,
            },
            {
                label: 'Acquired By',
                value: certificate.buyerName,
            },
            {
                label: 'Issue Date',
                value: certificate.issuedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            },
        ],
        footer: {
            text: 'Starry Night Premium Art Marketplace',
            verificationUrl: `https://starrynight.art/verify/${certificate.verificationCode}`,
        },
        blockchain: certificate.blockchainHash
            ? {
                label: 'Blockchain Verification',
                hash: certificate.blockchainHash,
            }
            : undefined,
    };
}
