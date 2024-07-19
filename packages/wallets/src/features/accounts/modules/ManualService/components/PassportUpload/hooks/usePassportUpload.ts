import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';

type TPassportUploadValues = {
    passportExpiryDate: string | null;
    passportFile?: File;
    passportNumber: string;
};

const usePassportUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const { error, isLoading, isSuccess, reset: resetError, upload } = useDocumentUpload();

    const submit = (values: FormikValues) => {
        return upload({
            document_id: values.passportNumber,
            document_issuing_country: documentIssuingCountryCode ?? undefined,
            document_type: 'passport',
            expiration_date: values.passportExpiryDate,
            file: values.passportFile,
        });
    };

    const initialValues = {
        passportExpiryDate: null,
        passportNumber: '',
    } as TPassportUploadValues;

    return {
        error: error?.error,
        initialValues,
        isSuccess,
        isUploading: isLoading,
        resetError,
        submit,
    };
};

export default usePassportUpload;
