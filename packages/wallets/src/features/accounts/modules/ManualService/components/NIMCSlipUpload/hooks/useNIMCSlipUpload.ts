import { useCallback } from 'react';
import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues, useSelfieUpload } from '../../SelfieUpload';

type TNIMCSlipUploadValues = TSelfieUploadValues & {
    nimcCardBack?: File;
    nimcCardFront?: File;
    nimcNumber: string;
};

const useNIMCSlipUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const {
        error: errorNIMCUpload,
        isLoading: isNIMCUploading,
        isSuccess: isNIMCUploadSuccess,
        reset: resetErrorNIMCUpload,
        upload: _upload,
    } = useDocumentUpload();
    const {
        error: errorSelfieUpload,
        isLoading: isSelfieUploading,
        isSuccess: isSelfieUploadSuccess,
        resetError: resetErrorSelfieUpload,
        upload: uploadSelfie,
    } = useSelfieUpload(documentIssuingCountryCode);

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
        [_upload, documentIssuingCountryCode]
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
        [_upload, documentIssuingCountryCode]
    );

    const upload = useCallback(
        async (values: FormikValues | TNIMCSlipUploadValues) => {
            await uploadFront(values);
            await uploadBack(values);
            await uploadSelfie(values, values.nimcNumber);
        },
        [uploadBack, uploadFront, uploadSelfie]
    );

    const resetError = useCallback(() => {
        if (errorNIMCUpload?.error || errorSelfieUpload) {
            resetErrorNIMCUpload();
            resetErrorSelfieUpload();
        }
    }, [errorNIMCUpload?.error, errorSelfieUpload, resetErrorNIMCUpload, resetErrorSelfieUpload]);

    const initialValues = {
        nimcNumber: '',
    } as TNIMCSlipUploadValues;

    return {
        /** contains error data if any error encountered during driving-license/selfie upload */
        error: errorNIMCUpload?.error ?? errorSelfieUpload,

        /** initial values for the driving-license and selfie forms */
        initialValues,

        /** `true` if successfully uploaded driving-license front/back and selfie files */
        isSuccess: isNIMCUploadSuccess && isSelfieUploadSuccess,

        /** `true` if driving-license and selfie upload is in progress */
        isUploading: isNIMCUploading || isSelfieUploading,

        /** reset all API errors */
        resetError,

        /** upload driving-license front/back and selfie files synchronously */
        upload,
    };
};

export default useNIMCSlipUpload;
