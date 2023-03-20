import { getFileExtension } from '../file-uploader-utils';

describe('getFileExtension', () => {
    const file = { type: 'image/png' };
    const expectedExtension = 'png';

    it('returns the file extension', () => {
        expect(getFileExtension(file)).toEqual(expectedExtension);
    });

    it('returns null if the file type is undefined', () => {
        expect(getFileExtension({})).toBeNull();
    });

    it('returns null if the file type does not contain a slash', () => {
        expect(getFileExtension({ type: 'imagepng' })).toBeNull();
    });
});
