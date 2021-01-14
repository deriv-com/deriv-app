import PropTypes from 'prop-types';
import DocumentUploader from '@binary-com/binary-document-uploader';
import { localize } from '@deriv/translations';
import { compressImageFiles, readFiles, DOCUMENT_TYPE, PAGE_TYPE } from '@deriv/shared';

const fileReadErrorMessage = filename => {
    return localize('Unable to read file {{name}}', { name: filename });
};

const uploadFile = (file, getSocket, settings) => {
    if (!file) return 0;

    // File uploader instance connected to binary_socket
    const uploader = new DocumentUploader({ connection: getSocket() });

    let is_file_error = false;

    return new Promise((resolve, reject) => {
        compressImageFiles([file]).then(files_to_process => {
            readFiles(files_to_process, fileReadErrorMessage, settings).then(processed_files => {
                processed_files.forEach(item => {
                    if (item.message) {
                        is_file_error = true;
                        reject(item);
                    }
                });
                const total_to_upload = processed_files.length;
                if (is_file_error || !total_to_upload) {
                    return; // don't start submitting files until all front-end validation checks pass
                }

                // send files
                const uploader_promise = uploader.upload(processed_files[0]).then(api_response => api_response);
                resolve(uploader_promise);
            });
        });
    });
};

uploadFile.propTypes = {
    file: PropTypes.element.isRequired,
    getSocket: PropTypes.func.isRequired,
    settings: PropTypes.shape({
        document_type: PropTypes.oneOf(Object.values(DOCUMENT_TYPE)).isRequired,
        page_type: PropTypes.oneOf(Object.values(PAGE_TYPE)),
        expiration_date: PropTypes.string,
    }),
};

export default uploadFile;
