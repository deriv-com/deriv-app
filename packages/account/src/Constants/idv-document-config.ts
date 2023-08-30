import { getUrlBase } from '@deriv/shared';
import { localize } from '@deriv/translations';

const getImageLocation = (image_name: string) => getUrlBase(`/public/images/common/${image_name}`);

// Note: Ensure that the object keys matches BE API's keys. This is simply a mapping for FE templates

export const getIDVDocumentConfig = () => ({
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
            example_format: 'B1234567',
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
});
