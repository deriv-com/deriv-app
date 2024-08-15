import DocumentUploader from '@binary-com/binary-document-uploader';
import { localize } from '@deriv/translations';
import { compressImageFiles, readFiles, TSettings } from '@deriv/shared';
import { TFile } from 'Types';

type TProcessedFile = TFile & TSettings & { message: string };

const fileReadErrorMessage = (filename: string) => {
    return localize('Unable to read file {{name}}', { name: filename });
};

const uploadFile = (file: File, getSocket: () => WebSocket, settings: TSettings) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject();
        }

        // File uploader instance connected to binary_socket
        const uploader = new DocumentUploader({ connection: getSocket() });

        let is_file_error = false;

        compressImageFiles([file])
            .then((files_to_process: Blob[]) => {
                readFiles(files_to_process, fileReadErrorMessage, settings)
                    .then(processed_files => {
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
                        uploader.upload(processed_files[0]).then(resolve).catch(reject);
                    })
                    /* eslint-disable no-console */
                    .catch(error => console.error('error: ', error));
            })
            /* eslint-disable no-console */
            .catch(error => console.error('error: ', error));
    });
};

export default uploadFile;
