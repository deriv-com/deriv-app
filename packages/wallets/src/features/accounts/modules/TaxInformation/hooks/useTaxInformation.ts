import { useEffect, useMemo, useState } from 'react';
import { FormikValues } from 'formik';
import { useQuery, useResidenceList, useSettings } from '@deriv/api-v2';
import { TSocketRequestPayload } from '@deriv/api-v2/types';
import { useTranslations } from '@deriv-com/translations';
import { THooks } from '../../../../../types';

type TTaxInformationValues = {
    accountOpeningReason: THooks.AccountSettings['account_opening_reason'];
    citizenship: THooks.AccountSettings['citizen'];
    placeOfBirth: THooks.AccountSettings['place_of_birth'];
    taxIdentificationNumber: THooks.AccountSettings['tax_identification_number'];
    taxResidence: THooks.AccountSettings['tax_residence'];
};

const useTaxInformation = (selectedJurisdiction: string) => {
    const { localize } = useTranslations();
    const {
        data: residenceList,
        isLoading: isResidenceListLoading,
        isSuccess: isResidenceListSuccess,
    } = useResidenceList();
    const { data: accountSettings, error, isSuccess: isAccountSettingsSuccess, update } = useSettings();
    const { data: landingCompanyDetailsData, isLoading: isLandingCompanyDetailsLoading } = useQuery(
        'landing_company_details',
        {
            options: {
                enabled: isAccountSettingsSuccess,
            },
            payload: {
                country: accountSettings.country_code ?? '',
                landing_company_details:
                    selectedJurisdiction as TSocketRequestPayload<'landing_company_details'>['payload']['landing_company_details'],
            },
        }
    );
    const [isSubmissionInitiated, setIsSubmissionInitiated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isTinMandatory = !landingCompanyDetailsData?.landing_company_details?.tin_not_mandatory;

    const countryCodeToPatternMapper = useMemo(() => {
        const countryCodeToPatternMapping: Record<string, string> = {};

        if (isResidenceListSuccess) {
            residenceList.forEach(residence => {
                if (residence.value && !(residence.value in countryCodeToPatternMapping)) {
                    countryCodeToPatternMapping[residence.value] = residence?.tin_format?.[0] ?? '';
                }
            });
        }
        return countryCodeToPatternMapping;
    }, [isResidenceListSuccess, residenceList]);

    const countryList = useMemo(() => {
        return residenceList.map(residence => ({
            text: residence.text ? localize(residence.text) : '',
            value: residence.value as string,
        }));
    }, [localize, residenceList]);

    const initialValues = {
        accountOpeningReason: accountSettings.account_opening_reason
            ? localize(accountSettings.account_opening_reason)
            : undefined,
        citizenship: accountSettings.citizen ? localize(accountSettings.citizen) : undefined,
        placeOfBirth: accountSettings.place_of_birth ? localize(accountSettings.place_of_birth) : undefined,
        taxIdentificationNumber: accountSettings.tax_identification_number
            ? localize(accountSettings.tax_identification_number)
            : undefined,
        taxResidence: accountSettings.tax_residence ? localize(accountSettings.tax_residence) : undefined,
    } as TTaxInformationValues;

    const onSubmit = (values: FormikValues | TTaxInformationValues) => {
        if (values && values.placeOfBirth && values.taxResidence && values.accountOpeningReason) {
            update({
                account_opening_reason: values.accountOpeningReason,
                citizen: values.citizenship,
                place_of_birth: values.placeOfBirth,
                ...(isTinMandatory && { tax_identification_number: values.taxIdentificationNumber }),
                tax_residence: values.taxResidence,
            });
            setIsSubmissionInitiated(true);
        }
    };

    useEffect(() => {
        if (isSubmissionInitiated && isAccountSettingsSuccess) {
            setIsSubmissionInitiated(false);
            setIsSubmitted(true);
        }
    }, [isAccountSettingsSuccess, isSubmissionInitiated]);

    return {
        countryCodeToPatternMapper,
        countryList,
        error,
        initialValues,
        isLoading: isResidenceListLoading || isLandingCompanyDetailsLoading,
        isSubmitted,
        isTinMandatory,
        onSubmit,
    };
};

export default useTaxInformation;
