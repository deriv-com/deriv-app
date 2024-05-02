import React, { memo, useCallback } from 'react';
import { DerivLightIcCloudUploadIcon, StandaloneCircleXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { FileDropzone } from '../FileDropzone';
import './FileUploaderComponent.scss';

type TFileUploaderComponentProps = {
    accept: string;
    hoverMessage: string;
    maxSize: number;
    multiple?: boolean;
    onClickClose: () => void;
    onDropAccepted: (files: File[]) => void;
    onDropRejected: (files: File[]) => void;
    uploadedMessage: string;
    validationErrorMessage: string | null;
    value: (File & { file: Blob })[];
};

const FileUploaderComponent = ({
    accept,
    hoverMessage,
    maxSize,
    multiple = false,
    onClickClose,
    onDropAccepted,
    onDropRejected,
    uploadedMessage,
    validationErrorMessage,
    value,
}: TFileUploaderComponentProps) => {
    const getUploadMessage = useCallback(() => {
        return (
            <>
                <DerivLightIcCloudUploadIcon height={50} width={50} />
                <Text as='div' size='sm' weight='bold'>
                    {uploadedMessage}
                </Text>
            </>
        );
    }, [uploadedMessage]);

    return (
        <div className='p2p-v2-file-uploader-component'>
            <FileDropzone
                accept={accept}
                errorMessage='Please upload supported file type.'
                filenameLimit={26}
                hoverMessage={hoverMessage}
                maxSize={maxSize}
                message={getUploadMessage()}
                multiple={multiple}
                onDropAccepted={onDropAccepted}
                onDropRejected={onDropRejected}
                validationErrorMessage={validationErrorMessage}
                value={value}
            />
            {(value.length > 0 || !!validationErrorMessage) && (
                <StandaloneCircleXmarkBoldIcon
                    className='p2p-v2-file-uploader-component__close-icon'
                    data-testid='dt_p2p_v2_remove_file_icon'
                    fill='#999'
                    onClick={onClickClose}
                />
            )}
        </div>
    );
};

export default memo(FileUploaderComponent);
