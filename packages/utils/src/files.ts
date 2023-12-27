/**
 * The function renames the files by removing any non ISO-8859-1 code point from filename and returns a new blob object with the updated file name.
 * @returns {Blob}
 */

export const renameFile = (file: File) => {
    const new_file = new Blob([file], { type: file.type });
    // @ts-expect-error Blob has a global declaration file in shared package only with name as attribute
    // eslint-disable-next-line no-control-regex
    new_file.name = file.name.replace(/[^\x00-\x7F]+/g, '');
    return new_file;
};
