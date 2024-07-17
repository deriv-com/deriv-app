import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';

type TPassportUploadValues = {
    passportExpiryDate: string | null;
    passportFile?: File;
    passportNumber: string;
};

const usePassportUpload = () => {
    const { error, isLoading, isSuccess, reset: resetError, upload } = useDocumentUpload();

    const submit = (values: FormikValues) => {
        upload({
            document_id: values.passportNumber,
            document_issuing_country: settings?.country_code ?? undefined,
            document_type: 'passport',
            expiration_date: values.passportExpiryDate,
            file: values.passport,
        });
    };

    const initialValues = {
        passportExpiryDate: null,
        passportNumber: '',
    } as TPassportUploadValues;

    return {
        error: error?.error,
        initialValues,
        isPassportUploadSuccess: isSuccess,
        isUploading: isLoading,
        resetError,
        submit,
    };
};

export default usePassportUpload;
