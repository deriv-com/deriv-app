import { useCallback } from 'react';
import { FormikValues } from 'formik';
import { useDocumentUpload, useSettings } from '@deriv/api';

const useHandleManualDocumentUpload = () => {
    const { data: settings } = useSettings();
    const { upload, ...rest } = useDocumentUpload();

    const uploadDocument = useCallback(
        async (formValues: FormikValues) => {
            if (formValues.selectedManualDocument === 'passport') {
                await upload({
                    document_id: formValues.passportNumber,
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: 'passport',
                    expiration_date: formValues.passportExpiryDate,
                    file: formValues.passportCard,
                });
            } else if (formValues.selectedManualDocument === 'identity-card') {
                await upload({
                    document_id: formValues.identityCardNumber,
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: 'national_identity_card',
                    expiration_date: formValues.identityCardExpiryDate,
                    file: formValues.identityCardFront,
                    page_type: 'front',
                });
                await upload({
                    document_id: formValues.identityCardNumber,
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: 'national_identity_card',
                    expiration_date: formValues.identityCardExpiryDate,
                    file: formValues.identityCardBack,
                    page_type: 'back',
                });
            } else if (formValues.selectedManualDocument === 'driving-license') {
                await upload({
                    document_id: formValues.drivingLicenceNumber,
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: 'driving_licence',
                    expiration_date: formValues.drivingLicenseExpiryDate,
                    file: formValues.drivingLicenseCardFront,
                    page_type: 'front',
                });
                await upload({
                    document_id: formValues.drivingLicenceNumber,
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: 'driving_licence',
                    expiration_date: formValues.drivingLicenseExpiryDate,
                    file: formValues.drivingLicenseCardBack,
                    page_type: 'back',
                });
            } else if (formValues.selectedManualDocument === 'nimc-slip') {
                await upload({
                    document_id: formValues.nimcNumber,
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: 'nimc_slip',
                    file: formValues.nimcCardFront,
                    page_type: 'front',
                });
                await upload({
                    document_id: formValues.nimcNumber,
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: 'nimc_slip',
                    file: formValues.nimcCardBack,
                    page_type: 'back',
                });
            }
        },
        [settings, upload]
    );

    return { uploadDocument, ...rest };
};

export default useHandleManualDocumentUpload;
