import { getUrlBase } from '@deriv/shared';

const idv_document_data = {
    ke: {
        alien_card: {
            example_format: '123456',
            sample_image: getUrlBase('/public/images/common/ke_alien_card.png'),
        },
        national_id: {
            example_format: '123456789',
            sample_image: getUrlBase('/public/images/common/ke_national_identity_card.png'),
        },
        passport: {
            example_format: 'A123456789',
            sample_image: getUrlBase('/public/images/common/ke_passport.png'),
        },
    },
    za: {
        national_id: {
            example_format: '1234567890123',
            sample_image: getUrlBase('/public/images/common/za_national_identity_card.png'),
        },
        national_id_no_photo: {
            example_format: '1234567890123',
            sample_image: '',
        },
    },
    ng: {
        bvn: {
            example_format: '12345678901',
            sample_image: '',
        },
        cac: {
            example_format: '12345678',
            sample_image: '',
        },
        drivers_license: {
            example_format: 'ABC123456789012',
            sample_image: getUrlBase('/public/images/common/ng_drivers_license.png'),
        },
        nin: {
            example_format: '12345678901',
            sample_image: '',
        },
        nin_slip: {
            example_format: '12345678901',
            sample_image: '',
        },
        tin: {
            example_format: '12345678-1234',
            sample_image: '',
        },
        voter_id: {
            example_format: '1234567890123',
            sample_image: getUrlBase('/public/images/common/ng_voter_id.png'),
        },
    },
};

export const getDocumentData = (country_code, document_type) => idv_document_data[country_code][document_type];

const getCharCount = (target_string, char) => target_string.match(new RegExp(`${char}`, 'g'))?.length || 0;

export const formatInput = (example_format, input_string, separator) => {
    const dash_index = example_format.indexOf(separator);
    const format_count = getCharCount(example_format, separator);
    const input_count = getCharCount(input_string, separator);

    if (dash_index !== -1 && input_count < format_count && input_string.length - 1 >= dash_index) {
        return input_string.slice(0, dash_index) + separator + input_string.slice(dash_index);
    }
    return input_string;
};
