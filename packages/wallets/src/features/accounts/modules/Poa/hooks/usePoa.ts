import { useMemo, useState } from 'react';
import { FormikValues } from 'formik';
import { useDocumentUpload, useSettings, useStatesList } from '@deriv/api-v2';
import { TAddressDetails, TDocumentSubmission } from '../types';

type TPoaValues = TAddressDetails & TDocumentSubmission;

const usePoa = () => {
    const {
        data: settings,
        isLoading: isSettingsLoading,
        isSuccess: isSettingsUpdateSuccess,
        update: updateSettings,
    } = useSettings();
    const country = settings?.country_code ?? '';
    const { data: statesList, isLoading: isStatesListLoading } = useStatesList(country);
    const {
        isLoading: isDocumentUploading,
        isSuccess: isDocumentUploadSuccess,
        upload: documentUpload,
    } = useDocumentUpload();
    const [isSubmissionInitiated, setIsSubmissionInitiated] = useState(false);

    const isLoading = isDocumentUploading || isSettingsLoading || isStatesListLoading;
    const isSubmissionSuccess = isSubmissionInitiated && isDocumentUploadSuccess && isSettingsUpdateSuccess;

    const initialValues = useMemo(
        () =>
            ({
                firstLine: settings.address_line_1,
                secondLine: settings.address_line_2,
                stateProvinceLine: settings.address_state,
                townCityLine: settings.address_city,
                zipCodeLine: settings.address_postcode,
            } as TPoaValues),
        [
            settings.address_city,
            settings.address_line_1,
            settings.address_line_2,
            settings.address_postcode,
            settings.address_state,
        ]
    );

    const initialStatus = useMemo(
        () => ({
            statesList,
        }),
        [statesList]
    );

    const submit = (values: FormikValues | TPoaValues) => {
        const isAddressDetailsFormDirty =
            values.firstLine !== settings.address_line_1 ||
            values.secondLine !== settings.address_line_2 ||
            values.stateProvinceLine !== settings.address_state ||
            values.townCityLine !== settings.address_city ||
            values.zipCodeLine !== settings.address_postcode;

        const isDocumentSelected = values.poaFile;

        if (isAddressDetailsFormDirty) {
            // update address details using set_settings, only if the form is dirty
            updateSettings({
                address_city: values.townCityLine,
                address_line_1: values.firstLine,
                address_line_2: values.secondLine,
                address_postcode: values.zipCodeLine,
                address_state: values.stateProvinceLine,
            });
        }

        if (isDocumentSelected) {
            // upload POA document using document_upload
            documentUpload({
                document_issuing_country: settings?.country_code ?? undefined,
                document_type: 'proofaddress',
                file: values.poaFile,
            });
        }

        setIsSubmissionInitiated(true);
    };

    return { initialStatus, initialValues, isLoading, isSuccess: isSubmissionSuccess, submit };
};
//
export default usePoa;
