/* eslint-disable no-console */
import React, { useState } from 'react';
import { InferType, object } from 'yup';
import { Loader } from '@deriv-com/ui';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { ManualForm } from '../../containers/ManualForm';
import { SelfieDocumentUpload } from '../../containers/SelfieDocumentUpload';
import { useManualForm } from '../../hooks';
import { OnfidoContainer } from '../../modules/Onfido';
import { getManualFormValidationSchema, getSelfieValidationSchema } from '../../utils/manualFormUtils';

type TManualUploadContainerProps = {
    selectedDocument: string | null;
    setSelectedDocument: (value: string | null) => void;
};

export const ManualUploadContainer = ({ selectedDocument, setSelectedDocument }: TManualUploadContainerProps) => {
    const { isExpiryDateRequired, isLoading, poiService } = useManualForm(
        'ng',
        selectedDocument as TManualDocumentTypes
    );

    const documentUploadSchema = getManualFormValidationSchema(
        selectedDocument as TManualDocumentTypes,
        isExpiryDateRequired
    );

    const selfieUploadSchema = getSelfieValidationSchema();

    const manualUploadSchema = object({
        ...documentUploadSchema.fields,
        ...selfieUploadSchema.fields,
    });

    type TManualUploadFormData = InferType<typeof manualUploadSchema>;

    const [formData, setFormData] = useState<Partial<TManualUploadFormData>>({});
    const [shouldUploadSelfie, setShouldUploadSelfie] = useState(false);

    if (isLoading || poiService === null) {
        return <Loader />;
    }

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

    if (poiService === 'manual') {
        return (
            <ManualForm
                formData={formData}
                isExpiryDateRequired={isExpiryDateRequired}
                onCancel={() => {
                    // TODO: Implement manual cancel
                    setSelectedDocument(null);
                }}
                onSubmit={values => {
                    // TODO: Implement manual submit
                    setFormData(prev => ({ ...prev, ...values }));
                    setShouldUploadSelfie(true);
                }}
                selectedDocument={selectedDocument as TManualDocumentTypes}
            />
        );
    }
    return (
        <OnfidoContainer
            country='ng'
            isEnabledByDefault
            onOnfidoSubmit={() => {
                // TODO: Implement onfido submit
            }}
            selectedDocument={selectedDocument as TManualDocumentTypes}
        />
    );
};
