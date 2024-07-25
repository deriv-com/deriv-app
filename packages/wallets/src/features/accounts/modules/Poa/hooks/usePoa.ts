import { useCallback, useMemo, useState } from 'react';
import { FormikValues } from 'formik';
import { useDocumentUpload, useSettings, useStatesList } from '@deriv/api-v2';
import { TAddressDetails, TDocumentSubmission } from '../types';

type TPoaValues = TAddressDetails & TDocumentSubmission;

const usePoa = () => {
    const {
        data: settings,
        error: errorSettings,
        isLoading: isSettingsLoading,
        isSuccess: isSettingsUpdateSuccess,
        update: updateSettings,
    } = useSettings();
    const country = settings?.country_code ?? '';
    const { data: statesList, isLoading: isStatesListLoading } = useStatesList(country);
    const {
        error: errorDocumentUpload,
        isLoading: isDocumentUploading,
        isSuccess: isDocumentUploadSuccess,
        upload: _upload,
    } = useDocumentUpload();
    const [isSubmissionInitiated, setIsSubmissionInitiated] = useState(false);

    const isLoading = isDocumentUploading || isSettingsLoading || isStatesListLoading;

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

    // since we call get_settings initially, isSubmissionSuccess helps us to distinguish
    // between the initial call and the upload call using the isSubmissionInitiated flag state
    // which is set only when user initiates submission
    const isSubmissionSuccess = isSubmissionInitiated && isDocumentUploadSuccess && isSettingsUpdateSuccess;

    const error = useMemo(
        () =>
            isSubmissionInitiated
                ? {
                      addressDetails: errorSettings?.error,
                      documentUpload: errorDocumentUpload?.error,
                  }
                : undefined,
        [errorDocumentUpload?.error, errorSettings?.error, isSubmissionInitiated]
    );

    const upload = useCallback(
        (values: FormikValues | TPoaValues) => {
            const isAddressDetailsFormDirty =
                values.firstLine !== settings.address_line_1 ||
                values.secondLine !== settings.address_line_2 ||
                values.stateProvinceLine !== settings.address_state ||
                values.townCityLine !== settings.address_city ||
                values.zipCodeLine !== settings.address_postcode;

            if (isAddressDetailsFormDirty) {
                // update address details using set_settings call, only if the form is dirty
                updateSettings({
                    address_city: values.townCityLine,
                    address_line_1: values.firstLine,
                    address_line_2: values.secondLine,
                    address_postcode: values.zipCodeLine,
                    address_state: values.stateProvinceLine,
                });
            }

            // upload POA document using document_upload
            _upload({
                document_issuing_country: settings?.country_code ?? undefined,
                document_type: 'proofaddress',
                file: values.poaFile,
            });
            setIsSubmissionInitiated(true);
        },
        [
            _upload,
            settings.address_city,
            settings.address_line_1,
            settings.address_line_2,
            settings.address_postcode,
            settings.address_state,
            settings?.country_code,
            updateSettings,
        ]
    );

    return {
        /** Error returned from API calls for address details update and POA document upload */
        error,

        /** Contains the shared countryList data which is shared between the AddressSection and DocumentSubmission components through the status object from Formik context*/
        initialStatus,

        /** Initial values for the POA form */
        initialValues,

        /** `true` if data required for initial render is loading */
        isLoading,

        /** `true` if the address details and document upload is successful */
        isSuccess: isSubmissionSuccess,

        /** Function to initiate upload of address details and document */
        upload,
    };
};
//
export default usePoa;
