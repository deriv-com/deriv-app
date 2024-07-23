import { useCallback } from 'react';
import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues, useSelfieUpload } from '../../SelfieUpload';

type TDrivingLicenseUploadValues = TSelfieUploadValues & {
    drivingLicenseCardBack?: File;
    drivingLicenseCardFront?: File;
    drivingLicenseExpiryDate: string;
    drivingLicenseNumber: string;
};

const useDrivingLicenseUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const {
        error: errorDrivingLicenseUpload,
        isLoading: isDrivingLicenseUploading,
        isSuccess: isDrivingLicenseUploadSuccess,
        reset: resetErrorDrivingLicenseUpload,
        upload: _upload,
    } = useDocumentUpload();
    const {
        error: errorSelfieUpload,
        isLoading: isSelfieUploading,
        isSuccess: isSelfieUploadSuccess,
        resetError: resetErrorSelfieUpload,
        upload: uploadSelfie,
    } = useSelfieUpload(documentIssuingCountryCode);

    const initialValues = {
        drivingLicenseExpiryDate: '',
        drivingLicenseNumber: '',
    } as TDrivingLicenseUploadValues;

    const uploadFront = useCallback(
        (values: FormikValues | TDrivingLicenseUploadValues) => {
            return _upload({
                document_id: values.drivingLicenseNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'driving_licence',
                expiration_date: values.drivingLicenseExpiryDate,
                file: values.drivingLicenseCardFront,
                page_type: 'front',
            });
        },
        [_upload, documentIssuingCountryCode]
    );

    const uploadBack = useCallback(
        (values: FormikValues | TDrivingLicenseUploadValues) => {
            return _upload({
                document_id: values.drivingLicenseNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'driving_licence',
                expiration_date: values.drivingLicenseExpiryDate,
                file: values.drivingLicenseCardBack,
                page_type: 'back',
            });
        },
        [_upload, documentIssuingCountryCode]
    );

    const upload = useCallback(
        async (values: FormikValues | TDrivingLicenseUploadValues) => {
            await uploadFront(values);
            await uploadBack(values);
            await uploadSelfie(values, values.drivingLicenseNumber);
        },
        [uploadBack, uploadFront, uploadSelfie]
    );

    const resetError = useCallback(() => {
        if (errorDrivingLicenseUpload?.error || errorSelfieUpload) {
            resetErrorDrivingLicenseUpload();
            resetErrorSelfieUpload();
        }
    }, [errorDrivingLicenseUpload?.error, errorSelfieUpload, resetErrorDrivingLicenseUpload, resetErrorSelfieUpload]);

    return {
        /** contains error data if any error encountered during driving-license/selfie upload */
        error: errorDrivingLicenseUpload?.error ?? errorSelfieUpload,

        /** initial values for the driving-license and selfie forms */
        initialValues,

        /** `true` if successfully uploaded driving-license front/back and selfie files */
        isSuccess: isDrivingLicenseUploadSuccess && isSelfieUploadSuccess,

        /** `true` if driving-license and selfie upload is in progress */
        isUploading: isDrivingLicenseUploading || isSelfieUploading,

        /** reset all API errors */
        resetError,

        /** upload driving-license front/back and selfie files synchronously */
        upload,
    };
};

export default useDrivingLicenseUpload;
