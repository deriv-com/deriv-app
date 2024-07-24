import { useMemo, useState } from 'react';
import { FormikValues } from 'formik';
import { useResidenceList, useSettings } from '@deriv/api-v2';
import { THooks } from '../../../../../types';

type TTaxInformationValues = {
    accountOpeningReason: THooks.AccountSettings['account_opening_reason'];
    citizenship: THooks.AccountSettings['citizen'];
    placeOfBirth: THooks.AccountSettings['place_of_birth'];
    taxIdentificationNumber: THooks.AccountSettings['tax_identification_number'];
    taxResidence: THooks.AccountSettings['tax_residence'];
};

const useTaxInformation = () => {
    const { data: residenceList, isLoading, isSuccess: isResidenceListSuccess } = useResidenceList();
    const { data: accountSettings, error, isSuccess: isAccountSettingsSuccess, update } = useSettings();
    const [isSubmissionInitiated, setIsSubmissionInitiated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const countryCodeToPatternMapper = useMemo(() => {
        const countryCodeToPatternMapping: Record<string, string> = {};

        if (isResidenceListSuccess) {
            // @ts-expect-error broken types for response of residence_list API call
            residenceList.forEach(residence => {
                if (residence.value && !(residence.value in countryCodeToPatternMapping)) {
                    countryCodeToPatternMapping[residence.value] = residence?.tin_format?.[0] ?? '';
                }
            });
        }
        return countryCodeToPatternMapping;
    }, [isResidenceListSuccess, residenceList]);

    const countryList = useMemo(() => {
        // @ts-expect-error broken types for response of residence_list API call
        return residenceList.map(residence => ({
            text: residence.text,
            value: residence.value ?? '',
        }));
    }, [residenceList]);

    const initialValues = useMemo(
        () =>
            ({
                accountOpeningReason: accountSettings.account_opening_reason,
                citizenship: accountSettings.citizen,
                placeOfBirth: accountSettings.place_of_birth,
                taxIdentificationNumber: accountSettings.tax_identification_number ?? undefined,
                taxResidence: accountSettings.tax_residence ?? undefined,
            } as TTaxInformationValues),
        [
            accountSettings.account_opening_reason,
            accountSettings.citizen,
            accountSettings.place_of_birth,
            accountSettings.tax_identification_number,
            accountSettings.tax_residence,
        ]
    );

    const getTaxResidence = (selected: string) => {
        // @ts-expect-error broken types for response of residence_list API call
        residenceList.find(residence => residence.text?.toLowerCase() === selected.toLowerCase())?.value;
    };

    const onSubmit = (values: FormikValues | TTaxInformationValues) => {
        if (
            values &&
            values.placeOfBirth &&
            values.taxResidence &&
            values.accountOpeningReason &&
            values.taxIdentificationNumber
        ) {
            update({
                account_opening_reason: values.accountOpeningReason,
                citizen: values.citizenship,
                place_of_birth: values.placeOfBirth,
                tax_identification_number: values.taxIdentificationNumber,
                tax_residence: values.taxResidence,
            });
            setIsSubmissionInitiated(true);
        }
    };

    if (isSubmissionInitiated && isAccountSettingsSuccess) {
        setIsSubmissionInitiated(false);
        setIsSubmitted(true);
    }

    return {
        countryCodeToPatternMapper,
        countryList,
        error,
        getTaxResidence,
        initialValues,
        isLoading,
        isSubmitted,
        onSubmit,
    };
};

export default useTaxInformation;
