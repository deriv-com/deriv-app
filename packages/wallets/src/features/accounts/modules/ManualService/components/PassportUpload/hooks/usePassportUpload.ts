import { useCallback } from 'react';
import { FormikValues } from 'formik';
import { DocumentUploadStatus, useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues, useSelfieUpload } from '../../SelfieUpload';

type TPassportUploadValues = TSelfieUploadValues & {
    passportExpiryDate: string | null;
    passportFile?: File;
    passportNumber: string;
};

const usePassportUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const {
        resetStatus: resetPassportUploadStatus,
        status: passportUploadStatus,
        upload: uploadPassport,
    } = useDocumentUpload();
    const {
        initialValues: initialValuesSelfieUpload,
        resetStatus: resetSelfieUploadStatus,
        status: selfieUploadStatus,
        upload: uploadSelfie,
    } = useSelfieUpload(documentIssuingCountryCode);

    const isError =
        passportUploadStatus === DocumentUploadStatus.ERROR || selfieUploadStatus === DocumentUploadStatus.ERROR;
    const isLoading =
        ((passportUploadStatus === DocumentUploadStatus.LOADING && selfieUploadStatus === DocumentUploadStatus.IDLE) ||
            selfieUploadStatus === DocumentUploadStatus.LOADING) &&
        !isError;
    const isSuccess =
        !isError &&
        !isLoading &&
        passportUploadStatus === DocumentUploadStatus.SUCCESS &&
        selfieUploadStatus === DocumentUploadStatus.SUCCESS;

    const initialValues = {
        ...initialValuesSelfieUpload,
        passportExpiryDate: null,
        passportNumber: '',
    } as TPassportUploadValues;

    const resetUploadStatus = () => {
        resetPassportUploadStatus(DocumentUploadStatus.IDLE);
        resetSelfieUploadStatus(DocumentUploadStatus.IDLE);
    };

    const upload = useCallback(
        async (values: FormikValues | TPassportUploadValues) => {
            try {
                await uploadPassport({
                    document_id: values.passportNumber,
                    document_issuing_country: documentIssuingCountryCode ?? undefined,
                    document_type: 'passport',
                    expiration_date: values.passportExpiryDate,
                    file: values.passportFile,
                });
                await uploadSelfie(values, values.passportNumber);

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        [documentIssuingCountryCode, uploadPassport, uploadSelfie]
    );

    return {
        /** initial values for the passport and selfie forms */
        initialValues,

        /** `true` when passport/selfie upload encounter error */
        isError,

        /** `true` when passport/selfie are uploading */
        isLoading,

        /** `true` when passport/selfie are uploaded successfully */
        isSuccess,

        /** Reset upload statuses for passport and selfie */
        resetUploadStatus,

        /** upload passport and selfie files synchronously */
        upload,
    };
};

export default usePassportUpload;
