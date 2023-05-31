import { getUrlBase } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const documentAdditionalError = (document_additional, document_additional_format) => {
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

export const getRegex = target_regex => {
    const output_regex = regex.find(r => r.regex_string === target_regex);
    if (output_regex) {
        return new RegExp(output_regex.value, output_regex.flags);
    }
    return new RegExp(target_regex);
};

export const getDocumentData = (country_code, document_type) => {
    return (
        (Object.keys(idv_document_data).includes(country_code) && idv_document_data[country_code][document_type]) || {
            new_display_name: '',
            example_format: '',
            sample_image: '',
        }
    );
};

const getImageLocation = image_name => getUrlBase(`/public/images/common/${image_name}`);

export const preventEmptyClipboardPaste = e => {
    const clipboardData = (e.clipboardData || window.clipboardData).getData('text');
    if (clipboardData.length === 0) {
        e.preventDefault();
    }
};

// Unsupported Regex List
const regex = [
    {
        regex_string: '^(?i)G[a-zA-Z0-9]{7,9}$',
        value: '^G[a-zA-Z0-9]{7,9}$',
        flags: 'i',
    },
];

// Note: Ensure that the object keys matches BE API's keys. This is simply a mapping for FE templates
const idv_document_data = {
    ke: {
        alien_card: {
            new_display_name: '',
            example_format: '123456',
            sample_image: getImageLocation('ke_alien_card.png'),
        },
        national_id: {
            new_display_name: '',
            example_format: '12345678',
            sample_image: getImageLocation('ke_national_identity_card.png'),
        },
        passport: {
            new_display_name: '',
            example_format: 'A12345678',
            sample_image: getImageLocation('ke_passport.png'),
        },
    },
    za: {
        national_id: {
            new_display_name: localize('National ID'),
            example_format: '1234567890123',
            sample_image: getImageLocation('za_national_identity_card.png'),
        },
        national_id_no_photo: {
            new_display_name: localize('National ID (No Photo)'),
            example_format: '1234567890123',
            sample_image: '',
        },
    },
    ng: {
        bvn: {
            new_display_name: localize('Bank Verification Number'),
            example_format: '12345678901',
            sample_image: '',
        },
        cac: {
            new_display_name: localize('Corporate Affairs Commission'),
            example_format: '12345678',
            sample_image: '',
        },
        drivers_license: {
            new_display_name: '',
            example_format: 'ABC123456789',
            sample_image: getImageLocation('ng_drivers_license.png'),
        },
        nin: {
            new_display_name: localize('National Identity Number'),
            example_format: '12345678901',
            sample_image: '',
        },
        nin_slip: {
            new_display_name: localize('National Identity Number Slip'),
            example_format: '12345678901',
            sample_image: getImageLocation('ng_nin_slip.png'),
        },
        tin: {
            new_display_name: localize('Taxpayer identification number'),
            example_format: '12345678-1234',
            sample_image: '',
        },
        voter_id: {
            new_display_name: localize('Voter ID'),
            example_format: '1234567890123456789',
            sample_image: getImageLocation('ng_voter_id.png'),
        },
    },
    gh: {
        drivers_license: {
            new_display_name: '',
            example_format: '12345678A1',
            sample_image: '',
        },
        national_id: {
            new_display_name: localize('National ID'),
            example_format: 'GHA-123456789-1',
            sample_image: '',
        },
        passport: {
            new_display_name: localize('Passport'),
            example_format: 'G1234567',
            sample_image: '',
        },
        ssnit: {
            new_display_name: localize('Social Security and National Insurance Trust'),
            example_format: 'C123456789012',
            sample_image: '',
        },
        voter_id: {
            new_display_name: localize('Voter ID'),
            example_format: '01234567890',
            sample_image: '',
        },
    },
    br: {
        cpf: {
            new_display_name: localize('CPF'),
            example_format: '123.456.789-12',
            sample_image: '',
        },
    },
    ug: {
        national_id: {
            new_display_name: localize('National ID'),
            example_format: 'CM12345678PE1D',
            sample_image: getImageLocation('ug_national_identity_card.png'),
        },
        national_id_no_photo: {
            new_display_name: localize('National ID (No Photo)'),
            example_format: 'CM12345678PE1D',
            sample_image: '',
        },
    },
    zw: {
        national_id: {
            new_display_name: localize('National ID'),
            example_format: '081234567F53',
            sample_image: getImageLocation('zw_national_identity_card.png'),
        },
    },
};
