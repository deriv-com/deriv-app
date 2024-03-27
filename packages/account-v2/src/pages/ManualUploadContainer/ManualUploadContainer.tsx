import React, { useState } from 'react';
import { InferType, object } from 'yup';
import { useDocumentUpload } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { MANUAL_DOCUMENT_SELFIE, TManualDocumentTypes } from '../../constants/manualFormConstants';
import { ManualForm } from '../../containers/ManualForm';
import { SelfieDocumentUpload } from '../../containers/SelfieDocumentUpload';
import { useManualForm } from '../../hooks';
import { OnfidoContainer } from '../../modules/Onfido';
import { getManualFormValidationSchema, getSelfieValidationSchema, getUploadConfig } from '../../utils';

type TManualUploadContainerProps = {
    countryCode: string;
    onDocumentSubmit: () => void;
    selectedDocument: string | null;
    setSelectedDocument: (value: string | null) => void;
};

export const ManualUploadContainer = ({
    countryCode,
    onDocumentSubmit,
    selectedDocument,
    setSelectedDocument,
}: TManualUploadContainerProps) => {
    const { isExpiryDateRequired, isLoading, poiService } = useManualForm(
        countryCode,
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
    const { upload } = useDocumentUpload();

    if (isLoading || poiService === null) {
        return <Loader />;
    }

    const processeDocuments = async (
        values: TManualUploadFormData,
        item: ReturnType<typeof getUploadConfig>[number]
    ) => {
        const { documentType, pageType } = item;
        return {
            document_id: values.documentNumber,
            document_issuing_country: countryCode,
            document_type: documentType,
            expiration_date: values?.documentExpiry?.toString() ?? undefined,
            file: documentType === MANUAL_DOCUMENT_SELFIE ? values[MANUAL_DOCUMENT_SELFIE] : values[pageType],
            lifetime_valid: isExpiryDateRequired ? 0 : 1,
            page_type: documentType === MANUAL_DOCUMENT_SELFIE ? 'photo' : pageType,
        };
    };

    const handleSubmit = async (values: TManualUploadFormData) => {
        const uploadDocumentConfig = getUploadConfig(selectedDocument as TManualDocumentTypes);

        try {
            await uploadDocumentConfig.reduce(async (promise, item) => {
                await promise;
                const payload = await processeDocuments(values, item);
                await upload(payload);
            }, Promise.resolve());
            onDocumentSubmit();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    if (shouldUploadSelfie) {
        return (
            <SelfieDocumentUpload
                formData={formData}
                handleCancel={() => setShouldUploadSelfie(false)}
                handleSubmit={values => {
                    handleSubmit({ ...formData, ...values });
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
    // [TODO]: Integrate country selector
    return (
        <OnfidoContainer
            countryCode={countryCode}
            isEnabledByDefault
            onOnfidoSubmit={() => {
                // [TODO]: Implement onfido submit
            }}
            selectedDocument={selectedDocument as TManualDocumentTypes}
        />
    );
};
