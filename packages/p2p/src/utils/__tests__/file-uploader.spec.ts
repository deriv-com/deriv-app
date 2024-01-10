import {
    TFile,
    convertToMB,
    getErrorMessage,
    getPotSupportedFiles,
    isImageType,
    isPDFType,
    truncateFileName,
} from 'Utils/file-uploader';

describe('convertToMB', () => {
    it('should convert bytes to MB', () => {
        expect(convertToMB(1024 * 1024)).toEqual(1);
    });
});

describe('getErrorMessage', () => {
    it('should return error message if file is too large', () => {
        const file = {
            file: {
                name: 'test.pdf',
                size: 1024 * 1024 * 6,
            },
        };
        expect(getErrorMessage([file as TFile])).toEqual('Cannot upload a file over 5MB');
    });

    it('should return error message if file is not supported', () => {
        const file = {
            file: {
                name: 'test.txt',
                size: 1024 * 1024 * 4,
            },
        };
        expect(getErrorMessage([file as TFile])).toEqual('The file you uploaded is not supported. Upload another.');
    });
});

describe('getPotSupportedFiles', () => {
    it('should return true if file is supported', () => {
        expect(getPotSupportedFiles('test.pdf')).toEqual(true);
    });

    it('should return false if file is not supported', () => {
        expect(getPotSupportedFiles('test.txt')).toEqual(false);
    });
});

describe('isImageType', () => {
    it('should return true if file is an image', () => {
        expect(isImageType('image/jpeg')).toEqual(true);
    });

    it('should return false if file is not an image', () => {
        expect(isImageType('application/pdf')).toEqual(false);
    });
});

describe('isPDFType', () => {
    it('should return true if file is a pdf', () => {
        expect(isPDFType('application/pdf')).toEqual(true);
    });

    it('should return false if file is not a pdf', () => {
        expect(isPDFType('image/jpeg')).toEqual(false);
    });
});

describe('truncateFileName', () => {
    const file = {
        name: 'example_file_name_that_is_longer_than_30_characters.jpg',
        type: 'image/jpeg',
        file: new Blob(),
    };

    it('should truncate file name if it is too long', () => {
        expect(truncateFileName(file as TFile, 30)).toEqual('example_file_name_that_is_long….jpeg');
    });
});
