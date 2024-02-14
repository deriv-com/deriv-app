/* eslint-disable no-console */
import React, { useState } from 'react';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { ManualForm } from '../../containers/ManualForm';
import { SelfieDocumentUpload } from '../../containers/SelfieDocumentUpload';

type TManualUploadContainerProps = {
    selectedDocument: string | null;
    setSelectedDocument: (value: string | null) => void;
};

export const ManualUploadContainer = ({ selectedDocument, setSelectedDocument }: TManualUploadContainerProps) => {
    const [formData, setFormData] = useState({});
    const [shouldUploadSelfie, setShouldUploadSelfie] = useState(false);

    if (shouldUploadSelfie) {
        return <SelfieDocumentUpload name='selfie' />;
    }
    return (
        <ManualForm
            onCancel={() => {
                console.log('Called on Cancel');
                setSelectedDocument(null);
                setShouldUploadSelfie(false);
            }}
            onSubmit={() => {
                console.log('Called submit');
                setShouldUploadSelfie(true);
            }}
            selectedDocument={selectedDocument as TManualDocumentTypes}
        />
    );
};
