import { isSupportedImageFormat } from '../file-utils';

describe('isSupportedImageFormat()', () => {
    it('should return true for supported image formats', () => {
        expect(isSupportedImageFormat('image1.png')).toBe(true);
        expect(isSupportedImageFormat('image1.jpg')).toBe(true);
        expect(isSupportedImageFormat('image1.jpeg')).toBe(true);
        expect(isSupportedImageFormat('image1.gif')).toBe(true);
        expect(isSupportedImageFormat('document.pdf')).toBe(true);
        expect(isSupportedImageFormat('mixed.CaSe.JPeG')).toBe(true);
    });

    it('should return false for unsupported image formats', () => {
        expect(isSupportedImageFormat('file.txt')).toBe(false);
        expect(isSupportedImageFormat('document.docx')).toBe(false);
        expect(isSupportedImageFormat('data.xml')).toBe(false);
        expect(isSupportedImageFormat('fake-image.jpg.txt')).toBe(false);
        expect(isSupportedImageFormat('compressed.jpg.rar')).toBe(false);
    });

    it('should handle edge cases', () => {
        // @ts-expect-error - test case to simulate passing null
        expect(isSupportedImageFormat(null)).toBe(false);
        // @ts-expect-error - test case to simulate passing undefined
        expect(isSupportedImageFormat(undefined)).toBe(false);
    });
});
