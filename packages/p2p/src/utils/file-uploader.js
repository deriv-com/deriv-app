export const convertToMB = bytes => bytes / (1024 * 1024);

export const getPotSupportedFiles = filename => /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|pdf|PDF)$/.test(filename);

export const max_pot_file_size = 2097152;
