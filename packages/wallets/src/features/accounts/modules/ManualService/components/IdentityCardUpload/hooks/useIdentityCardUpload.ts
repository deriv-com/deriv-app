import { useCallback } from 'react';
import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues, useSelfieUpload } from '../../SelfieUpload';

type TIdentityCardUploadValues = TSelfieUploadValues & {
    identityCardBack?: File;
    identityCardExpiryDate: string;
    identityCardFront?: File;
    identityCardNumber: string;
};

const useIdentityCardUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const {
        error: errorIdentityCardUpload,
        isLoading: isIdentityCardUploading,
        isSuccess: isIdentityCardUploadSuccess,
        reset: resetErrorIdentityCardUpload,
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
        identityCardExpiryDate: '',
        identityCardNumber: '',
    } as TIdentityCardUploadValues;

    const uploadFront = useCallback(
        (values: FormikValues) => {
            return _upload({
                document_id: values.identityCardNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'national_identity_card',
                expiration_date: values.identityCardExpiryDate,
                file: values.identityCardFront,
                page_type: 'front',
            });
        },
        [documentIssuingCountryCode, _upload]
    );

    const uploadBack = useCallback(
        (values: FormikValues) => {
            return _upload({
                document_id: values.identityCardNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'national_identity_card',
                expiration_date: values.identityCardExpiryDate,
                file: values.identityCardBack,
                page_type: 'back',
            });
        },
        [documentIssuingCountryCode, _upload]
    );

    const upload = useCallback(
        async (values: FormikValues | TIdentityCardUploadValues) => {
            await uploadFront(values);
            await uploadBack(values);
            await uploadSelfie(values, values.identityCardNumber);
        },
        [uploadBack, uploadFront, uploadSelfie]
    );

    const resetError = useCallback(() => {
        if (errorIdentityCardUpload?.error || errorSelfieUpload) {
            resetErrorIdentityCardUpload();
            resetErrorSelfieUpload();
        }
    }, [errorIdentityCardUpload?.error, errorSelfieUpload, resetErrorIdentityCardUpload, resetErrorSelfieUpload]);

    return {
        /** contains error data if any error encountered during identity-card/selfie upload */
        error: errorIdentityCardUpload?.error ?? errorSelfieUpload,

        /** initial values for the identity-card and selfie forms */
        initialValues,

        /** `true` if successfully uploaded identity-card front/back and selfie files */
        isSuccess: isIdentityCardUploadSuccess && isSelfieUploadSuccess,

        /** `true` if identity-card and selfie upload is in progress */
        isUploading: isIdentityCardUploading || isSelfieUploading,

        /** reset all API errors */
        resetError,

        /** upload identity-card front/back and selfie files synchronously */
        upload,
    };
};

export default useIdentityCardUpload;
