import { useState } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';

type TIdentityCardUploadValues = {
    identityCardBack?: File;
    identityCardExpiryDate: string;
    identityCardFront?: File;
    identityCardNumber: string;
};

const useIdentityCardUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const { error, isSuccess, reset: resetError, upload } = useDocumentUpload();
    const [isIdentityCardUploadSuccess, setIsIdentityCardUploadSuccess] = useState(false);

    const uploadFront = (values: FormikValues) => {
        return upload({
            document_id: values.identityCardNumber,
            document_issuing_country: documentIssuingCountryCode ?? undefined,
            document_type: 'national_identity_card',
            expiration_date: values.identityCardExpiryDate,
            file: values.identityCardFront,
            page_type: 'front',
        });
    };

    const uploadBack = (values: FormikValues) => {
        return upload({
            document_id: values.identityCardNumber,
            document_issuing_country: documentIssuingCountryCode ?? undefined,
            document_type: 'national_identity_card',
            expiration_date: values.identityCardExpiryDate,
            file: values.identityCardBack,
            page_type: 'back',
        });
    };

    const submit = async (values: FormikValues, helpers: FormikHelpers<TIdentityCardUploadValues>) => {
        try {
            await uploadFront(values);
            await uploadBack(values);
            if (isSuccess) {
                setIsIdentityCardUploadSuccess(true);
            }
        } catch {
            // reset the form if errors
            helpers.resetForm();
        }
    };

    const initialValues = {
        identityCardExpiryDate: '',
        identityCardNumber: '',
    } as TIdentityCardUploadValues;

    return { error: error?.error, initialValues, isIdentityCardUploadSuccess, resetError, submit };
};

export default useIdentityCardUpload;
