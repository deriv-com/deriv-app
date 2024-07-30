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
        resetStatus: resetIdentityCardUploadStatus,
        status: identityCardUploadStatus,
        upload: uploadIdentityCard,
    } = useDocumentUpload();
    const {
        initialValues: initialValuesSelfieUpload,
        resetStatus: resetSelfieUploadStatus,
        status: selfieUploadStatus,
        upload: uploadSelfie,
    } = useSelfieUpload(documentIssuingCountryCode);

    const isError = identityCardUploadStatus === 'error' || selfieUploadStatus === 'error';
    const isLoading =
        ((identityCardUploadStatus === 'loading' && selfieUploadStatus === 'idle') ||
            selfieUploadStatus === 'loading') &&
        !isError;
    const isSuccess =
        !isError && !isLoading && identityCardUploadStatus === 'success' && selfieUploadStatus === 'success';

    const initialValues = {
        ...initialValuesSelfieUpload,
        identityCardExpiryDate: '',
        identityCardNumber: '',
    } as TIdentityCardUploadValues;

    const resetUploadStatus = () => {
        resetIdentityCardUploadStatus('idle');
        resetSelfieUploadStatus('idle');
    };

    const uploadFront = useCallback(
        (values: FormikValues) => {
            return uploadIdentityCard({
                document_id: values.identityCardNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'national_identity_card',
                expiration_date: values.identityCardExpiryDate,
                file: values.identityCardFront,
                page_type: 'front',
            });
        },
        [uploadIdentityCard, documentIssuingCountryCode]
    );

    const uploadBack = useCallback(
        (values: FormikValues) => {
            return uploadIdentityCard({
                document_id: values.identityCardNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'national_identity_card',
                expiration_date: values.identityCardExpiryDate,
                file: values.identityCardBack,
                page_type: 'back',
            });
        },
        [uploadIdentityCard, documentIssuingCountryCode]
    );

    const upload = useCallback(
        async (values: FormikValues | TIdentityCardUploadValues) => {
            try {
                await uploadFront(values);
                await uploadBack(values);
                await uploadSelfie(values, values.identityCardNumber);

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        [uploadBack, uploadFront, uploadSelfie]
    );

    return {
        /** initial values for the identity-card and selfie forms */
        initialValues,

        /** `true` when identity-card/selfie upload encounter error */
        isError,

        /** `true` when identity-card/selfie are uploading */
        isLoading,

        /** `true` when identity-card/selfie are uploaded successfully */
        isSuccess,

        /** Reset upload statuses for identity-card and selfie */
        resetUploadStatus,

        /** upload identity-card and selfie files synchronously */
        upload,
    };
};

export default useIdentityCardUpload;
