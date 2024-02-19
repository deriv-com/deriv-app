/* eslint-disable no-console */
import React, { useState } from 'react';
import { InferType } from 'yup';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { ManualForm } from '../../containers/ManualForm';
import { SelfieDocumentUpload } from '../../containers/SelfieDocumentUpload';
import { useManualForm } from '../../hooks';
import { getManualFormValidationSchema, getSelfieValidationSchema } from '../../utils/manual-form-utils';

type TManualUploadContainerProps = {
    selectedDocument: string | null;
    setSelectedDocument: (value: string | null) => void;
};

export const ManualUploadContainer = ({ selectedDocument, setSelectedDocument }: TManualUploadContainerProps) => {
    const { isExpiryDateRequired } = useManualForm();

    const manualUpload = getManualFormValidationSchema(
        selectedDocument as TManualDocumentTypes,
        isExpiryDateRequired
    ).concat(getSelfieValidationSchema());

    type TManualUploadFormData = InferType<typeof manualUpload>;

    const [formData, setFormData] = useState<Partial<TManualUploadFormData>>({});
    const [shouldUploadSelfie, setShouldUploadSelfie] = useState(false);

    if (shouldUploadSelfie) {
        return (
            <SelfieDocumentUpload
                formData={formData}
                handleCancel={() => setShouldUploadSelfie(false)}
                handleSubmit={values => {
                    setFormData(prev => ({ ...prev, ...values }));
                }}
            />
        );
    }
    return (
        <ManualForm
            formData={formData}
            onCancel={() => {
                console.log('Called on Cancel');
                setSelectedDocument(null);
            }}
            onSubmit={values => {
                console.log('Called submit');
                setFormData(prev => ({ ...prev, ...values }));
                setShouldUploadSelfie(true);
            }}
            selectedDocument={selectedDocument as TManualDocumentTypes}
        />
    );
};
