export type TIDVDocumentConfig = {
    [key: string]: {
        [key: string]: {
            additionalDocumentExampleFormat?: string;
            exampleFormat?: string;
        };
    };
};

export const getIDVDocumentExampleFormat = (): TIDVDocumentConfig => ({
    ar: {
        dni: {
            exampleFormat: '12345678',
        },
    },
    br: {
        cpf: {
            exampleFormat: '123.456.789-12',
        },
    },
    cl: {
        national_id: {
            exampleFormat: '123456789',
        },
    },
    gh: {
        drivers_license: {
            exampleFormat: 'B1234567',
        },
        national_id: {
            exampleFormat: 'GHA-123456789-1',
        },
        passport: {
            exampleFormat: 'G1234567',
        },
        ssnit: {
            exampleFormat: 'C123456789012',
        },
        voter_id: {
            exampleFormat: '01234567890',
        },
    },
    id: {
        nik: {
            exampleFormat: '1234567890123456',
        },
    },
    in: {
        aadhaar: {
            additionalDocumentExampleFormat: 'ABCDE1234F',
            exampleFormat: '123456789012',
        },
        drivers_license: {
            exampleFormat: 'AB1234567890123',
        },
        epic: {
            exampleFormat: 'ABC1234567',
        },
        pan: {
            exampleFormat: 'ABCDE1234F',
        },
        passport: {
            additionalDocumentExampleFormat: 'AB1234567890123',
            exampleFormat: 'A1234567',
        },
    },
    ke: {
        alien_card: {
            exampleFormat: '123456',
        },
        national_id: {
            exampleFormat: '12345678',
        },
        passport: {
            exampleFormat: 'A12345678',
        },
    },
    mx: {
        curp: {
            exampleFormat: 'ABCD123456HEFGIJ00',
        },
    },
    ng: {
        drivers_license: {
            exampleFormat: 'ABC123456789',
        },
        nin: {
            exampleFormat: '12345678901',
        },
        nin_slip: {
            exampleFormat: '12345678901',
        },
        tin: {
            exampleFormat: '12345678-1234',
        },
        voter_id: {
            exampleFormat: '1234567890123456789',
        },
    },
    pe: {
        national_id: {
            exampleFormat: '12345678',
        },
    },
    ug: {
        national_id: {
            exampleFormat: 'CM12345678PE1D',
        },
        national_id_no_photo: {
            additionalDocumentExampleFormat: '0123456789',
            exampleFormat: 'CM12345678PE1D',
        },
    },
    vn: {
        national_id: {
            exampleFormat: '12345678901',
        },
    },
    za: {
        national_id: {
            exampleFormat: '1234567890123',
        },
    },
    zw: {
        national_id: {
            exampleFormat: '081234567F53',
        },
    },
});
