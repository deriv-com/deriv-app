import React from 'react';
import classNames from 'classnames';
import DocumentUploader from '@binary-com/binary-document-uploader';
import { FileDropzone, Icon, useStateCallback } from '@deriv/components';
import { localize } from '@deriv/translations';
import {
    isMobile,
    compressImageFiles,
    readFiles,
    getSupportedFiles,
    max_document_size,
    supported_filetypes,
} from '@deriv/shared';
import { TFile } from 'Types';

type TFileObject = {
    file: TFile;
};

const UploadMessage = () => {
    return (
        <React.Fragment>
            <Icon icon='IcCloudUpload' className='dc-file-dropzone__message-icon' size={50} />
            <div className='dc-file-dropzone__message-subtitle'>
                {isMobile() ? localize('Click here to upload') : localize('Drop file or click here to upload')}
            </div>
        </React.Fragment>
    );
};

const fileReadErrorMessage = (filename: string) => {
    return localize('Unable to read file {{name}}', { name: filename });
};

const FileUploader = React.forwardRef<
    HTMLElement,
    { onFileDrop: (file: TFile | undefined) => void; getSocket: () => WebSocket }
>(({ onFileDrop, getSocket }, ref) => {
    const [document_file, setDocumentFile] = useStateCallback({ files: [], error_message: null });

    const handleAcceptedFiles = (files: TFileObject[]) => {
        if (files.length > 0) {
            setDocumentFile({ files, error_message: null }, (file: TFile) => {
                onFileDrop(file);
            });
        }
    };

    const handleRejectedFiles = (files: TFileObject[]) => {
        const is_file_too_large = files.length > 0 && files[0].file.size > max_document_size;
        const supported_files = files.filter(each_file => getSupportedFiles(each_file.file.name));
        const error_message =
            is_file_too_large && supported_files.length > 0
                ? localize('File size should be 8MB or less')
                : localize('File uploaded is not supported');

        setDocumentFile({ files, error_message }, (file: TFile) => onFileDrop(file));
    };

    const removeFile = () => {
        setDocumentFile({ files: [], error_message: null }, (file: TFile) => onFileDrop(file));
    };

    const upload = () => {
        if (!!document_file.error_message || document_file.files.length < 1) return 0;

        // File uploader instance connected to binary_socket
        const uploader = new DocumentUploader({ connection: getSocket() });

        let is_any_file_error = false;

        return new Promise((resolve, reject) => {
            compressImageFiles(document_file.files)
                .then(files_to_process => {
                    readFiles(files_to_process, fileReadErrorMessage)
                        .then(processed_files => {
                            processed_files.forEach(file => {
                                if (file.message) {
                                    is_any_file_error = true;
                                    reject(file);
                                }
                            });
                            const total_to_upload = processed_files.length;
                            if (is_any_file_error || !total_to_upload) {
                                onFileDrop(undefined);
                                return; // don't start submitting files until all front-end validation checks pass
                            }

                            // send files
                            const uploader_promise = uploader
                                .upload(processed_files[0])
                                .then((api_response: unknown) => api_response);
                            resolve(uploader_promise);
                        })
                        /* eslint-disable no-console */
                        .catch(error => console.error('error: ', error));
                })
                /* eslint-disable no-console */
                .catch(error => console.error('error: ', error));
        });
    };

    React.useImperativeHandle(ref, () => ({
        upload,
    }));

    return (
        <React.Fragment>
            <FileDropzone
                accept={supported_filetypes}
                error_message={localize('Please upload supported file type.')}
                filename_limit={26}
                hover_message={localize('Drop files here..')}
                max_size={max_document_size}
                message={<UploadMessage />}
                multiple={false}
                onDropAccepted={handleAcceptedFiles}
                onDropRejected={handleRejectedFiles}
                validation_error_message={document_file.error_message}
                value={document_file.files}
            />
            {(document_file.files.length > 0 || !!document_file.error_message) && (
                <div className='account-poa__upload-remove-btn-container'>
                    <Icon
                        icon='IcCloseCircle'
                        className={classNames('account-poa__upload-remove-btn', {
                            'account-poa__upload-remove-btn--error': !!document_file.error_message,
                        })}
                        onClick={removeFile}
                        color='secondary'
                        data_testid='dt_remove_file_icon'
                    />
                </div>
            )}
        </React.Fragment>
    );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;
