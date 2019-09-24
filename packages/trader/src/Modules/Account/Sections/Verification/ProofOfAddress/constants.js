import { localize } from 'App/i18n';

export const max_document_size = 8388608;

export const supported_filetypes = 'image/png, image/jpeg, image/jpg, image/gif, application/pdf';

export const getSupportedFiles = (filename) => /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|pdf|PDF)$/.test(filename);

export const filesize_error_message = localize('File size should be 8MB or less');

export const unsupported_file_message = localize('File uploaded is not supported');

export const getFormatFromMIME = (file) => (file.type.split('/')[1] || (file.name.match(/\.([\w\d]+)$/) || [])[1] || '').toUpperCase();
