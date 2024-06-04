import { convertToBase64, isSupportedImageFormat } from '../file-utils';

describe('convertToBase64()', () => {
    const mockImageFile = new File(['image-data-contents'], 'image1.jpg', { type: 'image/jpeg' });

    it('should convert a File to base64', async () => {
        const base64Image = await convertToBase64(mockImageFile);

        expect(base64Image).toEqual(
            expect.objectContaining({
                src: expect.any(String),
                filename: 'image1.jpg',
            })
        );

        expect(base64Image.src).toMatch(/^data:image\/jpeg;base64,/);
    });

    it('should handle empty files', async () => {
        const mockFile = new File([], 'empty.txt', { type: 'text/plain' });
        const base64Image = await convertToBase64(mockFile);

        expect(base64Image).toEqual(
            expect.objectContaining({
                src: 'data:text/plain;base64,',
                filename: 'empty.txt',
            })
        );
    });

    it('should handle files with special characters in their names', async () => {
        const mockFile = new File(['file contents'], 'special&chars.jpg', { type: 'image/jpeg' });
        const base64Image = await convertToBase64(mockFile);

        expect(base64Image).toEqual(
            expect.objectContaining({
                src: expect.any(String),
                filename: 'special&chars.jpg',
            })
        );

        expect(base64Image.src).toMatch(/^data:image\/jpeg;base64,/);
    });

    it('should handle non-image files', async () => {
        const mockFile = new File(['file contents'], 'document.pdf', { type: 'application/pdf' });
        const base64Image = await convertToBase64(mockFile);

        expect(base64Image).toEqual(
            expect.objectContaining({
                src: expect.any(String),
                filename: 'document.pdf',
            })
        );

        expect(base64Image.src).toMatch(/^data:application\/pdf;base64,/);
    });

    it('should handle files with no type information', async () => {
        const mockFile = new File(['file contents'], 'unknown', { type: '' });
        const base64Image = await convertToBase64(mockFile);

        expect(base64Image).toEqual(
            expect.objectContaining({
                src: expect.any(String),
                filename: 'unknown',
            })
        );
    });
});

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
