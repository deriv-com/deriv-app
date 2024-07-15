import { FormikContextType, FormikValues } from 'formik';
import { useDocumentUpload, useSettings } from '@deriv/api-v2';

type TPassportUploadValues = {
    passportExpiryDate: string;
    passportFile?: File;
    passportNumber: string;
};

const usePassportUpload = () => {
    const { data: accountSettings } = useSettings();
    const { error, isLoading, isSuccess, upload } = useDocumentUpload();

    const submit = (values: FormikValues, context: FormikContextType<TPassportUploadValues>) => {
        if (context.dirty) {
            upload({
                document_id: values.passportNumber,
                document_issuing_country: accountSettings?.country_code ?? undefined,
                document_type: 'passport',
                expiration_date: values.passportExpiryDate,
                file: values.passport,
            });
        }
    };

    const initialValues = {
        passportExpiryDate: '',
        passportNumber: '',
    } as TPassportUploadValues;

    return { initialValues, submit };
};

export default usePassportUpload;
