import { getFileExtension } from '../file-uploader-utils';

describe('getFileExtension', () => {
    const file = { type: 'image/png' };
    const expectedExtension = 'png';

    it('returns the file extension', () => {
        expect(getFileExtension(file)).toEqual(expectedExtension);
    });
});
