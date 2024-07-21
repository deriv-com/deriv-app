import { useCallback, useState } from 'react';
import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues, useSelfieUpload } from '../../SelfieUpload';

type TPassportUploadValues = TSelfieUploadValues & {
    passportExpiryDate: string | null;
    passportFile?: File;
    passportNumber: string;
};

const usePassportUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const {
        error: errorPassportUpload,
        isLoading: isPassportUploading,
        isSuccess: isPassportUploadSuccess,
        reset: resetErrorPassportUpload,
        upload: uploadPassport,
    } = useDocumentUpload();
    const {
        error: errorSelfieUpload,
        initialValues: initialValuesSelfieUpload,
        isLoading: isSelfieUploading,
        isSuccess: isSelfieUploadSuccess,
        resetError: resetErrorSelfieUpload,
        upload: uploadSelfie,
    } = useSelfieUpload(documentIssuingCountryCode);
    const [uploadError, setUploadError] = useState<TSocketError<'document_upload'>['error']>();

    const initialValues = {
        ...initialValuesSelfieUpload,
        passportExpiryDate: null,
        passportNumber: '',
    } as TPassportUploadValues;

    const upload = useCallback(
        async (values: FormikValues | TPassportUploadValues) => {
            // wait on passport upload and set uploadError if any
            await uploadPassport({
                document_id: values.passportNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'passport',
                expiration_date: values.passportExpiryDate,
                file: values.passportFile,
            });
            if (errorPassportUpload) {
                setUploadError(errorPassportUpload.error);
            }
            // wait on selfie upload and set uploadError if any
            await uploadSelfie(values, values.passportNumber);
            if (errorSelfieUpload) {
                setUploadError(errorSelfieUpload);
            }
        },
        [documentIssuingCountryCode, errorPassportUpload, errorSelfieUpload, uploadPassport, uploadSelfie]
    );

    const resetError = useCallback(() => {
        if (uploadError) {
            resetErrorPassportUpload();
            resetErrorSelfieUpload();
        }
    }, [resetErrorPassportUpload, resetErrorSelfieUpload, uploadError]);

    return {
        /** contains error data if any error encountered during passport/selfie upload */
        error: uploadError,

        /** initial values for the passport and selfie forms */
        initialValues,

        /** `true` if successfully uploaded passport and selfie files */
        isSuccess: isPassportUploadSuccess && isSelfieUploadSuccess,

        /** `true` if passport and selfie upload is in progress */
        isUploading: isPassportUploading && isSelfieUploading,

        /** reset all API errors */
        resetError,

        /** upload passport and selfie files synchronously */
        upload,
    };
};

export default usePassportUpload;
