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
        resetStatus: resetDrivingLicenseUploadStatus,
        status: drivingLicenseUploadStatus,
        upload: uploadDrivingLicense,
    } = useDocumentUpload();
    const {
        initialValues: initialValuesSelfieUpload,
        resetStatus: resetSelfieUploadStatus,
        status: selfieUploadStatus,
        upload: uploadSelfie,
    } = useSelfieUpload(documentIssuingCountryCode);

    const isError = drivingLicenseUploadStatus === 'error' || selfieUploadStatus === 'error';
    const isLoading =
        ((drivingLicenseUploadStatus === 'loading' && selfieUploadStatus === 'idle') ||
            selfieUploadStatus === 'loading') &&
        !isError;
    const isSuccess =
        !isError && !isLoading && drivingLicenseUploadStatus === 'success' && selfieUploadStatus === 'success';

    const initialValues = {
        ...initialValuesSelfieUpload,
        drivingLicenseExpiryDate: '',
        drivingLicenseNumber: '',
    } as TDrivingLicenseUploadValues;

    const resetUploadStatus = () => {
        resetDrivingLicenseUploadStatus('idle');
        resetSelfieUploadStatus('idle');
    };

    const uploadFront = useCallback(
        (values: FormikValues | TDrivingLicenseUploadValues) => {
            return uploadDrivingLicense({
                document_id: values.drivingLicenseNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'driving_licence',
                expiration_date: values.drivingLicenseExpiryDate,
                file: values.drivingLicenseCardFront,
                page_type: 'front',
            });
        },
        [documentIssuingCountryCode, uploadDrivingLicense]
    );

    const uploadBack = useCallback(
        (values: FormikValues | TDrivingLicenseUploadValues) => {
            return uploadDrivingLicense({
                document_id: values.drivingLicenseNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'driving_licence',
                expiration_date: values.drivingLicenseExpiryDate,
                file: values.drivingLicenseCardBack,
                page_type: 'back',
            });
        },
        [documentIssuingCountryCode, uploadDrivingLicense]
    );

    const upload = useCallback(
        async (values: FormikValues | TDrivingLicenseUploadValues) => {
            try {
                await uploadFront(values);
                await uploadBack(values);
                await uploadSelfie(values, values.drivingLicenseNumber);

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        [uploadBack, uploadFront, uploadSelfie]
    );

    return {
        /** initial values for the driving-license and selfie forms */
        initialValues,

        /** `true` when driving-license/selfie upload encounter error */
        isError,

        /** `true` when driving-license/selfie are uploading */
        isLoading,

        /** `true` when driving-license/selfie are uploaded successfully */
        isSuccess,

        /** Reset upload statuses for driving-license and selfie */
        resetUploadStatus,

        /** upload driving-license and selfie files synchronously */
        upload,
    };
};

export default useDrivingLicenseUpload;
