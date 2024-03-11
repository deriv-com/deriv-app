/**
 * Checks if the file type is an image
 * @param {string} type
 * @returns {boolean} true if image, false otherwise
 */
export const isImageType = (type: string): boolean => ['image/jpeg', 'image/png', 'image/gif'].includes(type);

/**
 * Checks if the file type is a pdf
 * @param {string} type
 * @returns {boolean} true if pdf, false otherwise
 */
export const isPDFType = (type: string): boolean => type === 'application/pdf';

/**
 * Convert bytes to MB
 * @param {number} bytes
 * @returns {number} MB
 */
export const convertToMB = (bytes: number): number => bytes / (1024 * 1024);
