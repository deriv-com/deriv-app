import * as Yup from 'yup';

import { GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import { formatDate, getLocation, toMoment } from '@deriv/shared';

import {
    getAddressDetailValidationSchema,
    getPersonalDetailsBaseValidationSchema,
} from 'Configs/user-profile-validation-config';
import { PersonalDetailsValueTypes } from 'Types';

export const getPersonalDetailsInitialValues = (
    account_settings: GetSettings,
    residence_list: ResidenceList,
    states_list: StatesList,
    is_virtual?: boolean,
    selected_phone_code?: string,
    is_carriers_supported?: boolean,
    isCountryCodeDropdownEnabled?: string | boolean
): PersonalDetailsValueTypes => {
    const virtualAccountInitialValues: PersonalDetailsValueTypes = {
        email_consent: account_settings.email_consent ?? 0,
        residence: account_settings.residence,
    };
    if (is_virtual) return virtualAccountInitialValues;

    const initialValues = {
        ...virtualAccountInitialValues,
        address_city: account_settings.address_city,
        address_line_1: account_settings.address_line_1,
        address_line_2: account_settings.address_line_2 ?? '',
        address_postcode: account_settings.address_postcode ?? '',
        address_state: '',
        ...(isCountryCodeDropdownEnabled && {
            //@ts-expect-error calling_country_code is not defined in GetSettings type
            calling_country_code: account_settings.calling_country_code || selected_phone_code,
        }),
        ...(isCountryCodeDropdownEnabled && { is_carriers_available: is_carriers_supported }),
        date_of_birth: formatDate(account_settings.date_of_birth, 'YYYY-MM-DD'),
        first_name: account_settings.first_name,
        last_name: account_settings.last_name,
        place_of_birth: account_settings.place_of_birth,
        phone: isCountryCodeDropdownEnabled
            ? account_settings.phone?.replace(/\D/g, '')
            : `+${account_settings.phone?.replace(/\D/g, '')}`,
    };

    const isGetSettingsKey = (value: string): value is keyof GetSettings =>
        Object.keys(account_settings).includes(value);

    ['citizen', 'place_of_birth'].forEach(key => {
        if (isGetSettingsKey(key)) {
            if (account_settings[key]) {
                // @ts-expect-error keys will always be available
                initialValues[key] = getLocation(residence_list, account_settings[key] as string, 'text');
            }
        }
    });

    if (account_settings.address_state) {
        initialValues.address_state = states_list.length
            ? getLocation(states_list, account_settings.address_state, 'text')
            : account_settings.address_state;
    }

    if (account_settings.request_professional_status) {
        initialValues.request_professional_status = account_settings.request_professional_status;
    }

    return initialValues;
};

export const makeSettingsRequest = (
    settings: PersonalDetailsValueTypes,
    residence_list: ResidenceList,
    states_list: StatesList,
    is_virtual: boolean
) => {
    if (is_virtual && settings.email_consent) return { email_consent: settings.email_consent };
    const request = settings;

    //@ts-expect-error is_carriers_available is not defined in GetSettings type
    delete request.is_carriers_available;
    if (request.residence) delete request.residence;
    if (request.first_name) {
        request.first_name = request.first_name.trim();
    }

    if (request.last_name) {
        request.last_name = request.last_name.trim();
    }
    if (request.date_of_birth) {
        request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
    }

    if (request.citizen) {
        request.citizen = getLocation(residence_list, request.citizen, 'value');
    }

    if (request.place_of_birth) {
        request.place_of_birth = getLocation(residence_list, request.place_of_birth, 'value');
    } else {
        delete request.place_of_birth;
    }

    if (request.address_state) {
        request.address_state = states_list.length
            ? getLocation(states_list, request.address_state, 'value')
            : request.address_state;
    }

    return request;
};

interface PersonalValidationScheam {
    is_virtual?: boolean;
    is_svg?: boolean;
    isCountryCodeDropdownEnabled?: string | boolean;
    immutable_fields?: string[];
}

export const getPersonalDetailsValidationSchema = ({
    is_virtual,
    is_svg,
    isCountryCodeDropdownEnabled,
    immutable_fields,
}: PersonalValidationScheam) => {
    if (is_virtual) return Yup.object();

    const personal_details_schema = getPersonalDetailsBaseValidationSchema(
        '',
        !!isCountryCodeDropdownEnabled,
        immutable_fields
    ).pick([
        'first_name',
        'last_name',
        'phone',
        ...(isCountryCodeDropdownEnabled ? (['calling_country_code'] as const) : []),
        'date_of_birth',
        'citizen',
    ]);

    const address_detail_schema = getAddressDetailValidationSchema(is_svg ?? false, immutable_fields);

    return personal_details_schema.concat(address_detail_schema);
};
