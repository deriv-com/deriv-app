import { GetSettings, ResidenceList, StatesList } from '@deriv/api-types';

type initialValues = {
    addressCity?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressPostcode?: string;
    addressState?: string;
    dateOfBirth?: number | null;
    email?: string;
    emailConsent?: 0 | 1;
    employmentStatus?: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    placeOfBirth?: string;
    requestProfessionalStatus?: 1;
    residence?: string | null;
    taxIdentificationNumber?: string;
};

const getLocation = (location_list: StatesList, value: string, type: keyof StatesList[number]) => {
    if (!value || !location_list.length) return '';
    const locationObj = location_list.find(
        location => location[type === 'text' ? 'value' : 'text']?.toLowerCase() === value.toLowerCase()
    );

    return locationObj?.[type] ?? '';
};

export const getPersonalDetailsInitialValues = (
    accountSettings: GetSettings,
    residenceList: ResidenceList,
    statesList: StatesList,
    isSocialSignup?: boolean
) => {
    const initialValues: initialValues = {
        addressCity: accountSettings.address_city,
        addressLine1: accountSettings.address_line_1,
        addressLine2: accountSettings.address_line_2 ?? '',
        addressPostcode: accountSettings.address_postcode ?? '',
        addressState: '',
        dateOfBirth: accountSettings.date_of_birth,
        emailConsent: accountSettings.email_consent ?? 0,
        firstName: accountSettings.first_name,
        lastName: accountSettings.last_name,
        phone: accountSettings.phone,
        residence: accountSettings.residence,
        taxIdentificationNumber: accountSettings.tax_identification_number ?? '',
    };

    const isGetSettingsKey = (value: string): value is keyof GetSettings =>
        Object.keys(accountSettings).includes(value);

    const snakeToCamelCase = (key: string) => {
        return key.replace(/_([a-z])/g, function (match, letter) {
            return letter.toUpperCase();
        });
    };

    ['citizen', 'place_of_birth', 'tax_residence'].forEach(key => {
        if (isGetSettingsKey(key) && accountSettings[key]) {
            const camelCaseKey = snakeToCamelCase(key);
            // @ts-expect-error keys will always be available
            initialValues[camelCaseKey] = getLocation(residenceList, accountSettings[key] as string, 'text');
        }
    });

    if (isSocialSignup) {
        initialValues.email = accountSettings.email;
    }

    if (accountSettings.address_state) {
        initialValues.addressState = statesList.length
            ? getLocation(statesList, accountSettings.address_state, 'text')
            : accountSettings.address_state;
    }

    if (accountSettings.employment_status) {
        initialValues.employmentStatus = accountSettings.employment_status;
    }

    if (accountSettings.request_professional_status) {
        initialValues.requestProfessionalStatus = accountSettings.request_professional_status;
    }

    return initialValues;
};
