import React from 'react';
import { Dropzone } from '../../components/base/Dropzone';
import { WalletText } from '../../components/base/WalletText';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getTitleForDocumentUpload, getUploadConfig } from '../../utils/manualFormUtils';

type TManualFormDocumentUploadProps = { selectedDocument: TManualDocumentTypes };

export const ManualFormDocumentUpload = ({ selectedDocument }: TManualFormDocumentUploadProps) => {
    const uploadConfig = getUploadConfig(selectedDocument);

    return (
        <div className='flex flex-col gap-1200 pt-1200 border-t-solid-grey-2 border-solid border-t-100'>
            <WalletText>{getTitleForDocumentUpload(selectedDocument)}</WalletText>
            <div className='flex flex-col lg:flex-row gap-1200 w-full justify-between'>
                {uploadConfig.map(upload => (
                    <div className='w-full' key={upload.fileUploadText}>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            description={upload.fileUploadText}
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={upload.fileUploadIcon}
                            maxSize={8388608}
                            onFileChange={file => console.log(file.name)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
