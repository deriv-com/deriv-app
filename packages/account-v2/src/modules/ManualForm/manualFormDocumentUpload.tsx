import React, { Fragment } from 'react';
import { WalletText } from '../../components/base/WalletText';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getTitleForDocumentUpload, getUploadConfig } from '../../utils/manualFormUtils';
import { Dropzone } from '../../components/base/Dropzone';

type TManualFormDocumentUploadProps = { selectedDocument: TManualDocumentTypes };

export const ManualFormDocumentUpload = ({ selectedDocument }: TManualFormDocumentUploadProps) => {
    const uploadConfig = getUploadConfig(selectedDocument);

    return (
        <Fragment>
            <WalletText>{getTitleForDocumentUpload(selectedDocument)}</WalletText>
            <div className='flex gap-1200 w-full justify-between'>
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
        </Fragment>
    );
};
