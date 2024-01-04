import { renameFile } from '../files'; // Replace 'yourFileName' with the actual file name

describe('renameFile', () => {
    it('should remove non-ASCII characters from the file name', () => {
        const originalFileName = 'test_file_日本語.txt';
        const fakeFile = new File([], originalFileName);

        const renamedFile = renameFile(fakeFile);

        expect(renamedFile.name).not.toMatch('test_file_日本語.txt');
    });

    it('should preserve the file type and content', () => {
        const originalFileName = 'test_file.txt';
        const originalFileContent = 'This is a test file content.';
        const fakeFile = new File([originalFileContent], originalFileName, {
            type: 'text/plain',
        });
        const renamedFile = renameFile(fakeFile);
        expect(renamedFile.type).toBe(fakeFile.type);
    });
});
