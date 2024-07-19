import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues } from '../types';

const useSelfieUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const { error, isSuccess, reset, upload } = useDocumentUpload();

    const submit = (values: FormikValues) => {
        return upload({
            document_issuing_country: documentIssuingCountryCode ?? undefined,
            document_type: 'selfie_with_id',
            file: values.selfie,
        });
    };

    const initialValues = {} as TSelfieUploadValues;

    return { error: error?.error, initialValues, isSuccess, resetError: reset, submit };
};

export default useSelfieUpload;
