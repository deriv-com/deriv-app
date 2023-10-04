import React from 'react';
import classNames from 'classnames';
import { FileDropzone, Icon, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isMobile, getSupportedFiles, max_document_size, supported_filetypes } from '@deriv/shared';
import { TFile } from 'Types';
import { useFileUploader } from '@deriv/hooks';

type TFileObject = {
    file: TFile;
};
type TSettings = Partial<Parameters<ReturnType<typeof useFileUploader>['uploader']>[1]>;

const UploadMessage = () => {
    return (
        <React.Fragment>
            <Icon icon='IcUpload' className='dc-file-dropzone__message-icon' size={30} />
            <div className='dc-file-dropzone__message-subtitle'>
                <Text size='xxs' align='center' weight='bold' color='less-prominent'>
                    {isMobile() ? (
                        <Localize i18n_default_text='Click here to upload.' />
                    ) : (
                        <Localize i18n_default_text='Drag and drop a file or click to browse your files.' />
                    )}
                </Text>
                <Text size={isMobile() ? 'xxxxs' : 'xxxs'} align='center' color='less-prominent'>
                    <Localize i18n_default_text='Remember, selfies, pictures of houses, or non-related images will be rejected.' />
                </Text>
            </div>
        </React.Fragment>
    );
};

const FileUploader = React.forwardRef<
    HTMLElement,
    {
        onFileDrop: (files: File[]) => void;
        settings?: TSettings;
        onError?: (error_message: string) => void;
    }
>(({ onFileDrop, settings, onError }, ref) => {
    const [document_files, setDocumentFiles] = React.useState<File[] | null>(null);
    const [file_error, setFileError] = React.useState<string | null>(null);

    const { uploader } = useFileUploader();

    React.useEffect(() => {
        if (document_files) {
            onFileDrop(document_files);
        }
    }, [document_files, onFileDrop]);

    const handleAcceptedFiles = (files: File[]) => {
        if (files.length > 0) {
            setDocumentFiles(files);
            setFileError(null);
        }
    };

    const handleRejectedFiles = (files: TFileObject[]) => {
        const is_file_too_large = files.length > 0 && files[0].file.size > max_document_size;
        const supported_files = files.filter(each_file => getSupportedFiles(each_file.file.name));
        const error_message =
            is_file_too_large && supported_files.length > 0
                ? localize('File size should be 8MB or less')
                : localize('File uploaded is not supported');

        setDocumentFiles(null);
        onError?.(error_message);
        setFileError(error_message);
    };

    const removeFile = () => {
        setDocumentFiles(null);
    };

    const upload = () => {
        if (file_error || (document_files && document_files?.length < 1)) return 0;

        // @ts-expect-error FIXME: document_files is possibly null.
        uploader(document_files, settings, () => onFileDrop(undefined));
    };
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
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
                // @ts-expect-error Type FIXME: (TFileObject[]) => void' is not assignable to type '(fileRejections: FileRejection[], event: DropEvent) => void'.
                onDropRejected={handleRejectedFiles}
                validation_error_message={file_error}
                // @ts-expect-error FIXME: document_files is possibly null.
                value={document_files}
            />
            {((document_files && document_files?.length > 0) || file_error) && (
                <div className='file-uploader__remove-btn-container'>
                    <Icon
                        icon='IcCloseCircle'
                        className={classNames('file-uploader__remove-btn', {
                            'file-uploader__remove-btn--error': file_error,
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
