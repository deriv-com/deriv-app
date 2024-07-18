import { FormikValues } from 'formik';
import { useDocumentUpload, useSettings } from '@deriv/api-v2';
import { TSelfieUploadValues } from '../types';

const useSelfieUpload = () => {
    const { data: accountSettings } = useSettings();
    const { error, isSuccess, upload } = useDocumentUpload();

    const submit = (values: FormikValues) => {
        return upload({
            document_issuing_country: accountSettings?.country_code ?? undefined,
            document_type: 'selfie_with_id',
            file: values.selfie,
        });
    };

    const initialValues = {} as TSelfieUploadValues;

    return { error: error?.error, initialValues, isSuccess, submit };
};

export default useSelfieUpload;
