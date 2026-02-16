/**
 * Generate a unique serial number for limited edition artworks
 */
export function generateSerialNumber(
    artworkId: string,
    editionNumber: number,
    totalEditions: number
): string {
    // Format: ARTWORK-PREFIX-EDITION/TOTAL-RANDOM
    const prefix = artworkId.substring(0, 6).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `${prefix}-${editionNumber.toString().padStart(3, '0')}/${totalEditions.toString().padStart(3, '0')}-${timestamp}-${random}`;
}

/**
 * Generate multiple serial numbers for a limited edition
 */
export function generateSerialNumbers(
    artworkId: string,
    totalEditions: number
): string[] {
    const serialNumbers: string[] = [];

    for (let i = 1; i <= totalEditions; i++) {
        serialNumbers.push(generateSerialNumber(artworkId, i, totalEditions));
    }

    return serialNumbers;
}

/**
 * Validate serial number format
 */
export function validateSerialNumber(serialNumber: string): boolean {
    // Format: PREFIX-NNN/NNN-TIMESTAMP-RANDOM
    const pattern = /^[A-Z0-9]{6}-\d{3}\/\d{3}-[A-Z0-9]+-[A-Z0-9]{4}$/;
    return pattern.test(serialNumber);
}

/**
 * Parse serial number to extract information
 */
export function parseSerialNumber(serialNumber: string): {
    prefix: string;
    editionNumber: number;
    totalEditions: number;
    timestamp: string;
    random: string;
} | null {
    if (!validateSerialNumber(serialNumber)) {
        return null;
    }

    const parts = serialNumber.split('-');
    const editionParts = parts[1].split('/');

    return {
        prefix: parts[0],
        editionNumber: parseInt(editionParts[0], 10),
        totalEditions: parseInt(editionParts[1], 10),
        timestamp: parts[2],
        random: parts[3],
    };
}

/**
 * Check if serial number is unique in a list
 */
export function isSerialNumberUnique(
    serialNumber: string,
    existingSerialNumbers: string[]
): boolean {
    return !existingSerialNumbers.includes(serialNumber);
}

/**
 * Format serial number for display
 */
export function formatSerialNumberForDisplay(serialNumber: string): string {
    const parsed = parseSerialNumber(serialNumber);

    if (!parsed) {
        return serialNumber;
    }

    return `Edition ${parsed.editionNumber} of ${parsed.totalEditions}`;
}
