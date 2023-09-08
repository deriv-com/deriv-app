import React from 'react';
import { FileDropzone, Icon, Text } from '@deriv/components';
import { TFile } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { getErrorMessage } from 'Utils/file-uploader';

type TDocumentFile = {
    files: TFile[];
    error_message: string | null;
};

type TFileUploaderComponentProps = {
    accept: string;
    hover_message: string;
    max_size: number;
    multiple?: boolean;
    setDocumentFile: React.Dispatch<React.SetStateAction<TDocumentFile>>;
    upload_message: string;
    validation_error_message: string | null;
    value: File[];
};

type TUploadMessageProps = {
    upload_message: string;
};

const UploadMessage = ({ upload_message }: TUploadMessageProps) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <React.Fragment>
            <Icon icon='IcCloudUpload' size={50} />
            <Text as='div' line-height={is_mobile ? 'xl' : 'l'} size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                {upload_message}
            </Text>
        </React.Fragment>
    );
};

const FileUploaderComponent = ({
    accept,
    hover_message,
    max_size,
    multiple = false,
    setDocumentFile,
    upload_message,
    validation_error_message,
    value,
}: TFileUploaderComponentProps) => {
    const handleAcceptedFiles = (files: TFile[]) => {
        if (files.length > 0) {
            setDocumentFile({ files, error_message: null });
        }
    };

    const removeFile = () => {
        setDocumentFile({ files: [], error_message: null });
    };

    const handleRejectedFiles = (files: TFile[]) => {
        setDocumentFile({ files, error_message: getErrorMessage(files) });
    };

    return (
        <div className='file-uploader-component'>
            <FileDropzone
                accept={accept}
                error_message={localize('Please upload supported file type.')}
                filename_limit={26}
                hover_message={hover_message}
                max_size={max_size}
                message={<UploadMessage upload_message={upload_message} />}
                multiple={multiple}
                onDropAccepted={handleAcceptedFiles}
                onDropRejected={handleRejectedFiles}
                validation_error_message={validation_error_message}
                value={value}
            />
            {(value.length > 0 || !!validation_error_message) && (
                <Icon
                    className={'file-uploader-component__close-icon'}
                    color='secondary'
                    data_testid='dt_remove_file_icon'
                    icon='IcCloseCircle'
                    onClick={removeFile}
                />
            )}
        </div>
    );
};

export default FileUploaderComponent;
