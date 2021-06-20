const idv_document_data = {
    ke: {
        alien_card: {
            example_format: '123456',
            sample_image: 'ke_alien_card.png',
        },
        national_id: {
            example_format: '123456789',
            sample_image: 'ke_national_identity_card.png',
        },
        passport: {
            example_format: 'A123456789',
            sample_image: 'ke_passport.png',
        },
    },
    za: {
        national_id: {
            example_format: '1234567890123',
            sample_image: 'za_national_identity_card.png',
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
            sample_image: 'ng_drivers_license.png',
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
            sample_image: 'ng_voter_id.png',
        },
    },
};

export const getDocumentData = (country_code, document_type) => idv_document_data[country_code][document_type];

// Formats string based on separator and example format.
// Will get separator char position from example format and auto formats input string.
export const formatInput = (example_format, input_string, separator) => {
    const dash_index = example_format.indexOf(separator);
    if (dash_index !== -1) {
        if (input_string.length + 1 >= dash_index) {
            return input_string.splice(dash_index, 0, separator);
        }
    }
    return input_string;
};
