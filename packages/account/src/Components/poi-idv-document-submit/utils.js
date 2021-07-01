import { getUrlBase } from '@deriv/shared';

export const getDocumentData = (country_code, document_type) => idv_document_data[country_code][document_type];

// Automatically formats input string with separators based on example format arguement.
export const formatInput = (example_format, input_string, separator) => {
    const separator_index = example_format.indexOf(separator);
    const format_count = getCharCount(example_format, separator);
    const input_count = getCharCount(input_string, separator);

    if (separator_index !== -1 && input_count < format_count && input_string.length - 1 >= separator_index) {
        return input_string.slice(0, separator_index) + separator + input_string.slice(separator_index);
    }
    return input_string;
};

const getCharCount = (target_string, char) => target_string.match(new RegExp(`${char}`, 'g'))?.length || 0;

const getImageLocation = image_name => getUrlBase(`/public/images/common/${image_name}`);

// Note: Ensure that the object keys matches BE API's key. This is simply a mapping for FE templates
const idv_document_data = {
    ke: {
        alien_card: {
            example_format: '123456',
            sample_image: getImageLocation('ke_alien_card.png'),
        },
        national_id: {
            example_format: '123456789',
            sample_image: getImageLocation('ke_national_identity_card.png'),
        },
        passport: {
            example_format: 'A123456789',
            sample_image: getImageLocation('ke_passport.png'),
        },
    },
    za: {
        national_id: {
            example_format: '1234567890123',
            sample_image: getImageLocation('za_national_identity_card.png'),
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
            sample_image: getImageLocation('ng_drivers_license.png'),
        },
        nin: {
            example_format: '12345678901',
            sample_image: '',
        },
        nin_slip: {
            example_format: '12345678901',
            sample_image: getImageLocation('ng_nin_slip.png'),
        },
        tin: {
            example_format: '12345678-1234',
            sample_image: '',
        },
        voter_id: {
            example_format: '1234567890123456789',
            sample_image: getImageLocation('ng_voter_id.png'),
        },
    },
};
