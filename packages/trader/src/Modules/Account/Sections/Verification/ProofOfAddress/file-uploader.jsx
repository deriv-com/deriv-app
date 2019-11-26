import DocumentUploader from '@binary-com/binary-document-uploader';
import classNames       from 'classnames';
import React            from 'react';
import { FileDropzone } from 'deriv-components';
import { WS }           from 'Services/ws-methods';
import { localize }     from 'deriv-translations';
import IconCloudUpload  from 'Assets/AccountManagement/ProofOfAddress/icon-cloud-uploading.svg';
import IconRemoveFile   from 'Assets/AccountManagement/icon-remove-file.svg';
import {
    compressImageFiles,
    readFiles,
    getSupportedFiles,
    max_document_size,
    supported_filetypes } from './file-uploader-utils';

const UploadMessage = (
    <>
        <IconCloudUpload className='dc-file-dropzone__message-icon' />
        <div className='dc-file-dropzone__message-subtitle' >
            {localize('Drop file (JPEG  JPG  PNG  PDF  GIF) or click here to upload')}
        </div>
    </>
);

class FileUploader extends React.PureComponent {
    state = {
        document_file     : [],
        file_error_message: null,
    };

    handleAcceptedFiles = (files) => {
        if (files.length > 0) {
            this.setState({
                document_file     : files,
                file_error_message: null,
            }, () => {
                this.props.onFileDrop(this.state);
            });
        }
    }

    handleRejectedFiles = (files) => {
        const is_file_too_large  = files.length > 0 && files[0].size > max_document_size;
        const supported_files    = files.filter((file) => getSupportedFiles(file.name));
        const file_error_message = ((is_file_too_large && (supported_files.length > 0)) ?
            localize('File size should be 8MB or less')
            :
            localize('File uploaded is not supported')
        );

        this.setState({
            document_file: files,
            file_error_message,
        }, () => {
            this.props.onFileDrop(this.state);
        });
    }

    removeFile = () => {
        this.setState({
            document_file     : [],
            file_error_message: null,
        }, () => {
            this.props.onFileDrop(this.state);
        });
    }

    upload = () => {
        const {
            document_file,
            file_error_message,
        } = this.state;

        if (!!file_error_message || (document_file.length < 1)) return 0;

        // File uploader instance connected to binary_socket
        const uploader = new DocumentUploader({ connection: WS.getSocket() });

        let is_any_file_error = false;

        return new Promise((resolve, reject) => {
            compressImageFiles(this.state.document_file).then((files_to_process) => {
                readFiles(files_to_process).then((processed_files) => {
                    processed_files.forEach((file) => {
                        if (file.message) {
                            is_any_file_error = true;
                            reject(file);
                        }
                    });
                    const total_to_upload = processed_files.length;
                    if (is_any_file_error || !total_to_upload) {
                        this.props.onFileDrop(undefined);
                        return; // don't start submitting files until all front-end validation checks pass
                    }

                    // send files
                    const uploader_promise = uploader
                        .upload(processed_files[0])
                        .then((api_response) => api_response);
                    resolve(uploader_promise);
                });
            });
        });
    }

    render() {
        const {
            document_file,
            file_error_message,
        } = this.state;

        return (
            <>
                <FileDropzone
                    accept={supported_filetypes}
                    error_message={localize('Please upload supported file type.')}
                    hover_message={localize('Drop files here..')}
                    max_size={max_document_size}
                    message={UploadMessage}
                    multiple={false}
                    onDropAccepted={this.handleAcceptedFiles.bind(this)}
                    onDropRejected={this.handleRejectedFiles.bind(this)}
                    validation_error_message={file_error_message}
                    value={document_file}
                />
                {(document_file.length > 0 || !!file_error_message) &&
                <div className='account-poa__upload-remove-btn-container'>
                    <IconRemoveFile
                        className={classNames('account-poa__upload-remove-btn', {
                            'account-poa__upload-remove-btn--error': !!file_error_message,
                        })}
                        onClick={this.removeFile}
                    />
                </div>
                }
            </>
        );
    }
}

export default FileUploader;
