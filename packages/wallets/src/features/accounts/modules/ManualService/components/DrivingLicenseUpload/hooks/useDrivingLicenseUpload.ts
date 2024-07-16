import { useState } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';

type TDrivingLicenseUploadValues = {
    drivingLicenceNumber: string;
    drivingLicenseCardBack?: File;
    drivingLicenseCardFront?: File;
    drivingLicenseExpiryDate: string;
};

const useDrivingLicenseUpload = () => {
    const { error: _error, isSuccess, upload } = useDocumentUpload();
    const [isDrivingLicenseUploadSuccess, setIsDrivingLicenseUploadSuccess] = useState(false);

    const initialValues = {
        drivingLicenceNumber: '',
        drivingLicenseExpiryDate: '',
    } as TDrivingLicenseUploadValues;

    const uploadFront = (values: FormikValues) => {
        return upload({
            document_id: values.drivingLicenceNumber,
            document_issuing_country: settings?.country_code ?? undefined,
            document_type: 'driving_licence',
            expiration_date: values.drivingLicenseExpiryDate,
            file: values.drivingLicenseCardFront,
            page_type: 'front',
        });
    };

    const uploadBack = (values: FormikValues) => {
        return upload({
            document_id: values.drivingLicenceNumber,
            document_issuing_country: settings?.country_code ?? undefined,
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

    return { error: _error?.error, initialValues, isDrivingLicenseUploadSuccess, submit };
};

export default useDrivingLicenseUpload;
