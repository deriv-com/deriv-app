import { getPlatformFromUrl, getUrlBase } from '@deriv/shared';

const PATTERN_SIZE = 5;

export const isRecurringNumberRegex = document_number => document_number.replace(/[.-]*/g, '').match(/([0-9])\1{4,}/g);

const createDocumentPatterns = () => {
    const ID_PATTERN = '0123456789';
    const STEPS = 5; // Steps start at 0
    const reverse_pattern = ID_PATTERN.split('').reverse().join('');
    const pattern_array = [];

    for (let step = 0; step < STEPS; step++) {
        const pattern_end = PATTERN_SIZE + step;
        pattern_array.push(ID_PATTERN.substring(step, pattern_end));

        // Reverse version of the pattern, example: 9876543210
        pattern_array.push(reverse_pattern.substring(step, pattern_end));
    }

    return pattern_array;
};

export const documentAdditionalError = (document_additional, document_additional_format) => {
    let error_message = null;
    if (!document_additional) {
        error_message = 'Please enter your document number. ';
    } else {
        const format_regex = getRegex(document_additional_format);
        if (!format_regex.test(document_additional)) {
            error_message = 'Please enter the correct format. ';
        }
    }

    return error_message;
};

export const isSequentialNumber = document_number => {
    const trimmed_document_number = document_number.replace(/[.-]*/g, '');
    const pattern_results = [];

    if (document_number.length >= PATTERN_SIZE) {
        createDocumentPatterns().forEach(pattern => {
            pattern_results.push(trimmed_document_number.includes(pattern));
        });
    }

    return pattern_results.includes(true);
};

// function for skipping validation of exact document numbers for QA smileidentity sandbox testing
export const isIDVWhitelistDocumentNumber = (country, document_type, document_number) => {
    const is_whitelisted_number =
        idv_test_document_whitelist.has(country) &&
        idv_test_document_whitelist.get(country)[document_type] === document_number;

    return is_whitelisted_number && (getPlatformFromUrl().is_test_link || getPlatformFromUrl().is_staging);
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
            new_display_name: 'National ID',
            example_format: '1234567890123',
            sample_image: getImageLocation('za_national_identity_card.png'),
        },
        national_id_no_photo: {
            new_display_name: 'National ID (No Photo)',
            example_format: '1234567890123',
            sample_image: '',
        },
    },
    ng: {
        bvn: {
            new_display_name: 'Bank Verification Number',
            example_format: '12345678901',
            sample_image: '',
        },
        cac: {
            new_display_name: 'Corporate Affairs Commission',
            example_format: '12345678',
            sample_image: '',
        },
        drivers_license: {
            new_display_name: '',
            example_format: 'ABC123456789',
            sample_image: getImageLocation('ng_drivers_license.png'),
        },
        nin: {
            new_display_name: 'National Identity Number',
            example_format: '12345678901',
            sample_image: '',
        },
        nin_slip: {
            new_display_name: 'National Identity Number Slip',
            example_format: '12345678901',
            sample_image: getImageLocation('ng_nin_slip.png'),
        },
        tin: {
            new_display_name: 'Taxpayer identification number',
            example_format: '12345678-1234',
            sample_image: '',
        },
        voter_id: {
            new_display_name: 'Voter ID',
            example_format: '1234567890123456789',
            sample_image: getImageLocation('ng_voter_id.png'),
        },
    },
    gh: {
        drivers_license: {
            new_display_name: '',
            example_format: 'B1234567',
            sample_image: '',
        },
        national_id: {
            new_display_name: 'National ID',
            example_format: 'GHA-123456789-1',
            sample_image: '',
        },
        passport: {
            new_display_name: 'Passport',
            example_format: 'G1234567',
            sample_image: '',
        },
        ssnit: {
            new_display_name: 'Social Security and National Insurance Trust',
            example_format: 'C123456789012',
            sample_image: '',
        },
        voter_id: {
            new_display_name: 'Voter ID',
            example_format: '01234567890',
            sample_image: '',
        },
    },
    br: {
        cpf: {
            new_display_name: 'CPF',
            example_format: '123.456.789-12',
            sample_image: '',
        },
    },
    ug: {
        national_id: {
            new_display_name: 'National ID',
            example_format: 'CM12345678PE1D',
            sample_image: getImageLocation('ug_national_identity_card.png'),
        },
        national_id_no_photo: {
            new_display_name: 'National ID (No Photo)',
            example_format: 'CM12345678PE1D',
            sample_image: '',
        },
    },
    zw: {
        national_id: {
            new_display_name: 'National ID',
            example_format: '081234567F53',
            sample_image: getImageLocation('zw_national_identity_card.png'),
        },
    },
};

export const idv_test_document_whitelist = new Map([
    ['gh', { drivers_license: 'B0000000', passport: 'G0000000', ssnit: 'C000000000000', voter_id: '0000000000' }],
    ['ke', { alien_card: '000000', passport: 'A00000000', national_id: '00000000' }],
    ['ng', { drivers_license: 'ABC000000000', nin_slip: '00000000000', voter_id: '0000000000000000000' }],
    ['za', { national_id: '0000000000000', national_id_no_photo: '0000000000000' }],
]);
