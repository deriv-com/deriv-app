import * as Yup from 'yup';
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

const min2max50text = 'You should enter 2-50 characters.';
const lessThan70Text = 'Should be less than 70.';

const getBaseSchema = () =>
    Yup.object().shape({
        addressCity: Yup.string()
            .required('Town/City is required.')
            .max(70, lessThan70Text)
            .matches(
                /^[A-Za-z]+(?:[.' -]*[A-Za-z]+){1,70}$/,
                'Only letters, space, hyphen, period, and apostrophe are allowed.'
            ),
        addressLine1: Yup.string()
            .trim()
            .required('First line of address is required.')
            .max(70, lessThan70Text)
            .matches(/^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u, 'Use only the following special characters: 70'),
        addressLine2: Yup.string()
            .trim()
            .max(70, lessThan70Text)
            .matches(/^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u, 'Use only the following special characters: 70'),
        addressPostcode: Yup.string()
            .max(20, 'Please enter a Postal/ZIP code under 20 chatacters.')
            .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, 'Only letters, numbers, space, and hyphen are allowed.'),
        firstName: Yup.string()
            .required('First name is required.')
            .min(2, min2max50text)
            .max(50, min2max50text)
            .matches(/^(?!.*\s{2,})[\p{L}\s'.-]{2,50}$/u, 'Letters, spaces, periods, hyphens, apostrophes only.'),
        lastName: Yup.string()
            .required('Last name is required.')
            .min(2, min2max50text)
            .max(50, min2max50text)
            .matches(/^(?!.*\s{2,})[\p{L}\s'.-]{2,50}$/u, 'Letters, spaces, periods, hyphens, apostrophes only.'),
        phone: Yup.string()
            .required('Phone is required.')
            .min(9, 'You should enter 9-35 numbers.')
            .max(35, 'You should enter 9-35 characters.')
            .matches(/^\+?([0-9-]+\s)*[0-9-]+$/, 'Please enter a valid phone number (e.g. +15417541234).'),
    });

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

export const getPersonalDetailsValidationSchema = (is_eu: boolean) => {
    if (!is_eu) return getBaseSchema();
    return getBaseSchema().concat(
        Yup.object().shape({
            employmentStatus: Yup.string().required('Employment status is required.'),
            taxIdentificationNumber: Yup.string()
                .required('TIN is required.')
                .max(25, "Tax Identification Number can't be longer than 25 characters.")
                .matches(
                    /^(?!^$|\s+)[A-Za-z0-9./\s-]{0,25}$/,
                    'Only letters, numbers, space, hyphen, period, and forward slash are allowed.'
                )
                .matches(
                    /^[a-zA-Z0-9].*$/,
                    'Should start with letter or number and may contain a hyphen, period and slash.'
                ),
            taxResidence: Yup.string().required('Tax residence is required.'),
        })
    );
};
