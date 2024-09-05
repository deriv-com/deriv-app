import { useCallback } from 'react';
import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues } from '../types';

const useSelfieUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const { resetStatus, status, upload: _upload } = useDocumentUpload();

    const upload = useCallback(
        async (values: FormikValues, documentNumber: string) => {
            try {
                const response = await _upload({
                    document_id: documentNumber,
                    document_issuing_country: documentIssuingCountryCode ?? undefined,
                    document_type: 'selfie_with_id',
                    file: values.selfieFile,
                });
                return Promise.resolve(response);
            } catch (error) {
                return Promise.reject(error);
            }
        },
        [_upload, documentIssuingCountryCode]
    );

    const initialValues = {} as TSelfieUploadValues;

    return {
        /** initial values for the selfie forms */
        initialValues,

        /** Function to reset selfie upload status */
        resetStatus,

        /** Selfie upload status */
        status,

        /**
         * A function to upload selfie file for a particular document
         * @param values FormikValues of the form
         * @param documentNumber required to uniquely identify for which document is the selfie uploaded
         * */
        upload,
    };
};

export default useSelfieUpload;
