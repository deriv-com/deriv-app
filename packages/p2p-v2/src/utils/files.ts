/**
 * The function renames the files by removing any non ISO-8859-1 code point from filename and returns a new blob object with the updated file name.
 * @returns {Blob}
 */
export const renameFile = (file: File) => {
    const newFile = new Blob([file], { type: file.type });
    newFile.name = file.name
        .split('')
        .filter(char => char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126)
        .join('');
    return newFile;
};
