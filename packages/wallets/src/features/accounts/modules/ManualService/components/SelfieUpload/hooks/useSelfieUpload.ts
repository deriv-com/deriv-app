import { useState } from 'react';
import { FormikContextType, FormikValues } from 'formik';
import { useDocumentUpload, useSettings } from '@deriv/api-v2';
import { TSelfieUploadValues } from '../types';

const useSelfieUpload = () => {
    const { data: accountSettings } = useSettings();
    const { upload } = useDocumentUpload();
    const [isSelfieUploadSuccess, setIsSelfieUploadSuccess] = useState(false);

    const submit = (values: FormikValues, context: FormikContextType<TSelfieUploadValues>) => {
        if (context.dirty) {
            upload({
                document_issuing_country: accountSettings?.country_code ?? undefined,
                document_type: 'selfie_with_id',
                file: values.selfie,
            });
        }
    };

    return { submit };
};

export default useSelfieUpload;
