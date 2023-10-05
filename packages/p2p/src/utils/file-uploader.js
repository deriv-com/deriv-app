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
