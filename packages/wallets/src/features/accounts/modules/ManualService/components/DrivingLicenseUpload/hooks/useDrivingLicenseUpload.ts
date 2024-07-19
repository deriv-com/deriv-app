import { useState } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';

type TDrivingLicenseUploadValues = {
    drivingLicenseCardBack?: File;
    drivingLicenseCardFront?: File;
    drivingLicenseExpiryDate: string;
    drivingLicenseNumber: string;
};

const useDrivingLicenseUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const { error: _error, isSuccess, reset: resetError, upload } = useDocumentUpload();
    const [isDrivingLicenseUploadSuccess, setIsDrivingLicenseUploadSuccess] = useState(false);

    const initialValues = {
        drivingLicenseExpiryDate: '',
        drivingLicenseNumber: '',
    } as TDrivingLicenseUploadValues;

    const uploadFront = (values: FormikValues) => {
        return upload({
            document_id: values.drivingLicenceNumber,
            document_issuing_country: documentIssuingCountryCode ?? undefined,
            document_type: 'driving_licence',
            expiration_date: values.drivingLicenseExpiryDate,
            file: values.drivingLicenseCardFront,
            page_type: 'front',
        });
    };

    const uploadBack = (values: FormikValues) => {
        return upload({
            document_id: values.drivingLicenceNumber,
            document_issuing_country: documentIssuingCountryCode ?? undefined,
            document_type: 'driving_licence',
            expiration_date: values.drivingLicenseExpiryDate,
            file: values.drivingLicenseCardBack,
            page_type: 'back',
        });
    };
    const submit = async (values: FormikValues, helpers: FormikHelpers<TDrivingLicenseUploadValues>) => {
        try {
            await uploadFront(values);
            await uploadBack(values);
            if (isSuccess) {
                setIsDrivingLicenseUploadSuccess(true);
            }
        } catch {
            // reset the form if errors
            helpers.resetForm();
        }
    };

    return { error: _error?.error, initialValues, isSuccess: isDrivingLicenseUploadSuccess, resetError, submit };
};

export default useDrivingLicenseUpload;
