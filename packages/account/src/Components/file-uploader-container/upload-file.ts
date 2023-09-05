import DocumentUploader from '@binary-com/binary-document-uploader';
import { localize } from '@deriv/translations';
import { compressImageFiles, readFiles, DOCUMENT_TYPE, PAGE_TYPE } from '@deriv/shared';
import { TFile } from 'Types';

type TDocumentSettings = {
    documentType: keyof typeof DOCUMENT_TYPE;
    pageType: keyof typeof PAGE_TYPE;
    expirationDate: string;
    documentId: string;
    lifetimeValid: boolean;
};

type TProcessedFile = TFile & TDocumentSettings & { message: string };

const fileReadErrorMessage = (filename: string) => {
    return localize('Unable to read file {{name}}', { name: filename });
};

const uploadFile = (file: File, getSocket: () => WebSocket, settings: TDocumentSettings) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject();
        }

        // File uploader instance connected to binary_socket
        const uploader = new DocumentUploader({ connection: getSocket() });

        let is_file_error = false;

        compressImageFiles([file])
            .then((files_to_process: File[]) => {
                readFiles(files_to_process, fileReadErrorMessage, settings)
                    .then((processed_files: TProcessedFile[]) => {
                        processed_files.forEach((item: TProcessedFile) => {
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
