import { localize } from 'Components/i18next';

export const accepted_file_types = 'image/png, image/jpeg, image/jpg, application/pdf';

export const convertToMB = bytes => bytes / (1024 * 1024);

export const getPotSupportedFiles = filename => /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|pdf|PDF)$/.test(filename);

export const max_pot_file_size = 5242880;

export const isImageType = type => ['image/jpeg', 'image/png', 'image/gif'].includes(type);

export const isPDFType = type => type === 'application/pdf';

const isFileTooLarge = files => files?.length > 0 && files[0].file.size > max_pot_file_size;
const isFileSupported = files => files.filter(each_file => getPotSupportedFiles(each_file.file.name))?.length > 0;

export const getErrorMessage = files =>
    isFileTooLarge(files) && isFileSupported(files)
        ? localize('Cannot upload a file over 5MB')
        : localize('File uploaded is not supported');

/**
 * The function renames the files by removing any non ISO-8859-1 code point from filename and returns a new blob object with the updated file name.
 * @param {File} file
 * @returns {Blob}
 */
export const renameFile = file => {
    const new_file = new Blob([file], { type: file.type });
    // eslint-disable-next-line no-control-regex
    new_file.name = file.name.replace(/[^\x00-\x7F]+/g, '');
    return new_file;
};
