import { localize } from '@deriv/translations';

// Note: Ensure that the object keys matches BE API's keys. This is simply a mapping for FE templates

const getIDVDocumentConfig = () => ({
    ke: {
        alien_card: {
            new_display_name: '',
            example_format: '123456',
        },
        national_id: {
            new_display_name: '',
            example_format: '12345678',
        },
        passport: {
            new_display_name: '',
            example_format: 'A12345678',
        },
    },
    za: {
        national_id: {
            new_display_name: localize('National ID'),
            example_format: '1234567890123',
        },
        national_id_no_photo: {
            new_display_name: localize('National ID (No Photo)'),
            example_format: '1234567890123',
        },
    },
    ng: {
        bvn: {
            new_display_name: localize('Bank Verification Number'),
            example_format: '12345678901',
        },
        cac: {
            new_display_name: localize('Corporate Affairs Commission'),
            example_format: '12345678',
        },
        drivers_license: {
            new_display_name: '',
            example_format: 'ABC123456789',
        },
        nin: {
            new_display_name: localize('National Identity Number'),
            example_format: '12345678901',
        },
        nin_slip: {
            new_display_name: localize('National Identity Number Slip'),
            example_format: '12345678901',
        },
        tin: {
            new_display_name: localize('Taxpayer identification number'),
            example_format: '12345678-1234',
        },
        voter_id: {
            new_display_name: localize('Voter ID'),
            example_format: '1234567890123456789',
        },
    },
    gh: {
        drivers_license: {
            new_display_name: '',
            example_format: 'B1234567',
        },
        national_id: {
            new_display_name: localize('National ID'),
            example_format: 'GHA-123456789-1',
        },
        passport: {
            new_display_name: localize('Passport'),
            example_format: 'G1234567',
        },
        ssnit: {
            new_display_name: localize('Social Security and National Insurance Trust'),
            example_format: 'C123456789012',
        },
        voter_id: {
            new_display_name: localize('Voter ID'),
            example_format: '01234567890',
        },
    },
    br: {
        cpf: {
            new_display_name: localize('CPF'),
            example_format: '123.456.789-12',
        },
    },
    ug: {
        national_id: {
            new_display_name: localize('National ID'),
            example_format: 'CM12345678PE1D',
        },
        national_id_no_photo: {
            new_display_name: localize('National ID (No Photo)'),
            example_format: 'CM12345678PE1D',
            additional_document_example_format: '0123456789',
        },
    },
    zw: {
        national_id: {
            new_display_name: localize('National ID'),
            example_format: '081234567F53',
        },
    },
    cl: {
        national_id: {
            example_format: '123456789',
        },
    },
    ar: {
        dni: {
            example_format: '12345678',
        },
    },
    mx: {
        curp: {
            example_format: 'ABCD123456HEFGIJ00',
        },
    },
    id: {
        nik: {
            example_format: '1234567890123456',
        },
    },
    in: {
        aadhaar: {
            example_format: '123456789012',
            additional_document_example_format: 'ABCDE1234F',
        },
        drivers_license: {
            example_format: 'AB1234567890123',
        },
        epic: {
            example_format: 'ABC1234567',
        },
        pan: {
            example_format: 'ABCDE1234F',
        },
        passport: {
            example_format: 'A1234567',
            additional_document_example_format: 'AB1234567890123',
        },
    },
    pe: {
        national_id: {
            example_format: '12345678',
        },
    },
    vn: {
        national_id: {
            example_format: '12345678901',
        },
    },
});

export const getIDVDocuments = (country_code: string) => {
    const IDV_DOCUMENT_DATA: { [key: string]: object } = getIDVDocumentConfig();
    return IDV_DOCUMENT_DATA[country_code];
};
