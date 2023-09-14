import { filterObjProperties, toMoment, validLength, validName, getIDVNotApplicableOption } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { ResidenceList, GetSettings, GetAccountStatus } from '@deriv/api-types';
import { FormikValues } from 'formik';
import { getIDVDocumentConfig } from '../Constants/idv-document-config';

export const documentAdditionalError = (document_additional: string, document_additional_format: string) => {
    let error_message = null;
    if (!document_additional) {
        error_message = localize('Please enter your document number. ');
    } else {
        const format_regex = getRegex(document_additional_format);
        if (!format_regex.test(document_additional)) {
            error_message = localize('Please enter the correct format. ');
        }
    }

    return error_message;
};

// Unsupported Regex List
const regex = [
    {
        regex_string: '^(?i)G[a-zA-Z0-9]{7,9}$',
        value: '^G[a-zA-Z0-9]{7,9}$',
        flags: 'i',
    },
];

const IDV_NOT_APPLICABLE_OPTION = getIDVNotApplicableOption();

type TIDVSupportCheck = {
    residence_list: ResidenceList;
    account_settings: GetSettings;
    account_status: GetAccountStatus;
    real_account_signup_target: string;
    residence: string;
};

export const shouldShowIdentityInformation = ({
    account_status,
    account_settings,
    residence,
    residence_list,
    real_account_signup_target,
}: TIDVSupportCheck) => {
    const citizen = account_settings.citizen || residence;
    const country = residence_list.find(item => item.value === citizen);
    const maltainvest = real_account_signup_target === 'maltainvest';
    const should_skip_idv = account_status?.status?.some((status: string) => status === 'skip_idv'); //status added by BE when idv should be skipped for the user
    return Boolean(
        !maltainvest && citizen && country?.identity?.services?.idv?.is_country_supported && !should_skip_idv
    );
};

export const getDocumentData = (country_code: string, document_type: string) => {
    const IDV_DOCUMENT_DATA = getIDVDocumentConfig();
    return (
        (Object.keys(IDV_DOCUMENT_DATA).includes(country_code) &&
            (IDV_DOCUMENT_DATA as any)[country_code][document_type]) || {
            new_display_name: '',
            example_format: '',
            sample_image: '',
        }
    );
};

export const preventEmptyClipboardPaste = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const clipboardData = (e.clipboardData ?? window.clipboardData).getData('text');
    if (clipboardData.length === 0) {
        e.preventDefault();
    }
};

export const getRegex = (target_regex: string) => {
    const output_regex = regex.find(r => r.regex_string === target_regex);
    if (output_regex) {
        return new RegExp(output_regex.value, output_regex.flags);
    }
    return new RegExp(target_regex);
};

/**
 * @param {string} selected_doc  - Could be one of the following: 'drivers_license', 'ssnit', 'id_card', 'passport'
 * @returns {string} - Returns the placeholder text for the document number input
 */
export const generatePlaceholderText = (selected_doc: string) => {
    switch (selected_doc) {
        case 'drivers_license':
            return localize('Enter Driver License Reference number');
        case 'ssnit':
            return localize('Enter your SSNIT number');
        default:
            return localize('Enter your document number');
    }
};

export const validate =
    (errors: Record<string, string>, values: Record<string, string>) =>
    (fn: (value: string) => string, arr: string[], err_msg: string) => {
        arr.forEach(field => {
            const value = values[field];
            if (!fn(value) && !errors[field]) errors[field] = err_msg;
        });
    };

export const isFieldImmutable = (field: string, mutable_fields: string[] = []) => !mutable_fields.includes(field);

export const makeSettingsRequest = (values: FormikValues, changeable_fields: string[]) => {
    const request = filterObjProperties(values, changeable_fields);

    if (request.first_name) {
        request.first_name = request.first_name.trim();
    }
    if (request.last_name) {
        request.last_name = request.last_name.trim();
    }
    if (request.date_of_birth) {
        request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
    }

    return request;
};

export const validateName = (name: string) => {
    if (name) {
        if (!validLength(name.trim(), { min: 2, max: 50 })) {
            return localize('You should enter 2-50 characters.');
        } else if (!validName(name)) {
            return localize('Letters, spaces, periods, hyphens, apostrophes only.');
        }
    }
    return '';
};

export const getExampleFormat = (example_format: string | undefined) =>
    example_format ? localize('Example: ') + example_format : '';

export const isDocumentTypeValid = (document_type: FormikValues) => {
    if (!document_type?.text) {
        return localize('Please select a document type.');
    }
    return undefined;
};

export const isAdditionalDocumentValid = (document_type: FormikValues, document_additional: string) => {
    const error_message = documentAdditionalError(document_additional, document_type.additional?.format);
    if (error_message) {
        return localize(error_message) + getExampleFormat(document_type.additional?.example_format);
    }
    return undefined;
};

export const isDocumentNumberValid = (document_number: string, document_type: FormikValues) => {
    const is_document_number_invalid = document_number === document_type.example_format;
    if (!document_number) {
        return localize('Please enter your document number. ') + getExampleFormat(document_type.example_format);
    } else if (is_document_number_invalid) {
        return localize('Please enter a valid ID number.');
    }
    const format_regex = getRegex(document_type.value);
    if (!format_regex.test(document_number)) {
        return localize('Please enter the correct format. ') + getExampleFormat(document_type.example_format);
    }
    return undefined;
};

export const shouldHideHelperImage = (document_id: string) => document_id === IDV_NOT_APPLICABLE_OPTION.id;
