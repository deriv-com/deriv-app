import { localize } from 'Components/i18next';

export type TFile = File & { file: Blob };

export const max_pot_file_size = 5242880;

/**
 * Convert bytes to MB
 * @param {number} bytes
 * @returns {number} MB
 */
export const convertToMB = (bytes: number): number => bytes / (1024 * 1024);

/**
 * Gets the supported file extensions from the filename
 * @param {string} filename
 * @returns {boolean} true if supported, false otherwise
 */
export const getPotSupportedFiles = (filename: string): boolean =>
    /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|pdf|PDF)$/.test(filename);

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
 * Checks if the file is too large
 * @param {TFile[]} files
 * @returns {boolean} true if file is too large, false otherwise
 */
const isFileTooLarge = (files: TFile[]): boolean => files?.length > 0 && files[0].file.size > max_pot_file_size;

/**
 * Checks if the file is supported
 * @param {TFile[]} files
 * @returns {boolean} true if file is supported, false otherwise
 */
const isFileSupported = (files: TFile[]): boolean =>
    files.filter(each_file => getPotSupportedFiles(each_file.file.name))?.length > 0;

/**
 * Gets the error message for the file if it is not supported or too large
 * @param {TFile[]} files
 * @returns {string} error message
 */
export const getErrorMessage = (files: TFile[]): string =>
    isFileTooLarge(files) && isFileSupported(files)
        ? localize('Cannot upload a file over 5MB')
        : localize('The file you uploaded is not supported. Upload another.');

/**
 * Truncates the file name to a certain length
 * @param {TFile} file
 * @param {number} limit
 * @returns {string} truncated file name
 */
export const truncateFileName = (file: TFile, limit: number): string => {
    const string_limit_regex = new RegExp(`(.{${limit || 30}})..+`);
    return file?.name?.replace(string_limit_regex, `$1….${getFileExtension(file)}`);
};

/**
 * Gets the file extension
 * @param {TFile} file
 * @returns {string | null} file extension or null if not found
 */
const getFileExtension = (file: TFile): string | null => {
    const f = file?.type?.match(/[^/]+$/u);
    return f && f[0];
};

/**
 * The function renames the files by removing any non ISO-8859-1 code point from filename and returns a new blob object with the updated file name.
 * @param {TFile} file
 * @returns {Blob}
 */
export const renameFile = (file: TFile): Blob => {
    const new_file = new Blob([file], { type: file.type });
    // eslint-disable-next-line no-control-regex
    new_file.name = file.name.replace(/[^\x00-\x7F]+/g, '');
    return new_file;
};
