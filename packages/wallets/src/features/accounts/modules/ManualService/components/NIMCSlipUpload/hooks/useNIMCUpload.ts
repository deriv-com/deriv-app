import { useState } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';

type TNIMCUploadValues = {
    nimcCardBack?: File;
    nimcCardFront?: File;
    nimcNumber: string;
};

const useNIMCUpload = () => {
    const { error, isSuccess, reset: resetError, upload } = useDocumentUpload();
    const [isNIMCUploadSuccess, setIsNIMCUploadSuccess] = useState(false);

    const uploadFront = (values: FormikValues) => {
        return upload({
            document_id: values.identityCardNumber,
            document_issuing_country: settings?.country_code ?? undefined,
            document_type: 'national_identity_card',
            expiration_date: values.identityCardExpiryDate,
            file: values.identityCardFront,
            page_type: 'front',
        });
    };

    const uploadBack = (values: FormikValues) => {
        return upload({
            document_id: values.identityCardNumber,
            document_issuing_country: settings?.country_code ?? undefined,
            document_type: 'national_identity_card',
            expiration_date: values.identityCardExpiryDate,
            file: values.identityCardBack,
            page_type: 'back',
        });
    };

    const submit = async (values: FormikValues, helpers: FormikHelpers<TNIMCUploadValues>) => {
        try {
            await uploadFront(values);
            await uploadBack(values);
            if (isSuccess) {
                setIsNIMCUploadSuccess(true);
            }
        } catch {
            // reset the form if errors
            helpers.resetForm();
        }
    };

    const initialValues = {
        nimcNumber: '',
    } as TNIMCUploadValues;

    return { error: error?.error, initialValues, isNIMCUploadSuccess, resetError, submit };
};

export default useNIMCUpload;
