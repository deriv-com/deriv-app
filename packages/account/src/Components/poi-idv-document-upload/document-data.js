const idv_document_data = {
    ke: {
        alien_card: {
            example_format: '123456',
            sample_image: 'ke_alien_card.png',
        },
        national_identity_card: {
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

const getDocumentData = (country_code, document_type) => idv_document_data[country_code][document_type];

export default getDocumentData;
