import React from 'react';
import classNames from 'classnames';
import { useDevice } from '@deriv-com/ui';
import { Dropzone } from '../../components/base/Dropzone';
import { WalletText } from '../../components/base/WalletText';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getTitleForDocumentUpload, getUploadConfig } from '../../utils/manualFormUtils';

type TManualFormDocumentUploadProps = { selectedDocument: TManualDocumentTypes };

export const ManualFormDocumentUpload = ({ selectedDocument }: TManualFormDocumentUploadProps) => {
    const uploadConfig = getUploadConfig(selectedDocument);
    const { isDesktop } = useDevice();

    return (
        <div className='flex flex-col gap-1200 pt-1200 border-t-solid-general-section-1  border-solid border-t-100'>
            <WalletText>{getTitleForDocumentUpload(selectedDocument)}</WalletText>
            <div
                className={classNames('flex gap-1200 w-full justify-between', {
                    'flex-col': !isDesktop,
                })}
            >
                {uploadConfig.map(upload => (
                    <div className='w-full' key={upload.fileUploadText}>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            description={upload.fileUploadText}
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={upload.fileUploadIcon}
                            maxSize={8388608}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
