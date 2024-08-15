import { THooks } from '../../../../../../../types';
/* eslint-disable sort-keys */
type TDocumentNumberExamples = Record<
    string,
    Record<string, { additionalDocumentExampleFormat?: string; exampleFormat: string; newDisplayName?: string }>
>;

type TStatusCodes = Exclude<THooks.POA['status'] | THooks.POI['current']['status'], undefined>;

export const statusCodes: Record<TStatusCodes, string> = {
    expired: 'expired',
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    suspected: 'suspected',
    verified: 'verified',
} as const;

export const documentNumberExamples: TDocumentNumberExamples = {
    ke: {
        alien_card: {
            newDisplayName: '',
            exampleFormat: '123456',
        },
        national_id: {
            newDisplayName: '',
            exampleFormat: '12345678',
        },
        passport: {
            newDisplayName: '',
            exampleFormat: 'A12345678',
        },
    },
    za: {
        national_id: {
            newDisplayName: 'National ID',
            exampleFormat: '1234567890123',
        },
        national_id_no_photo: {
            newDisplayName: 'National ID (No Photo)',
            exampleFormat: '1234567890123',
        },
    },
    ng: {
        bvn: {
            newDisplayName: 'Bank Verification Number',
            exampleFormat: '12345678901',
        },
        cac: {
            newDisplayName: 'Corporate Affairs Commission',
            exampleFormat: '12345678',
        },
        drivers_license: {
            newDisplayName: '',
            exampleFormat: 'ABC123456789',
        },
        nin: {
            newDisplayName: 'National Identity Number',
            exampleFormat: '12345678901',
        },
        nin_slip: {
            newDisplayName: 'National Identity Number Slip',
            exampleFormat: '12345678901',
        },
        tin: {
            newDisplayName: 'Taxpayer identification number',
            exampleFormat: '12345678-1234',
        },
        voter_id: {
            newDisplayName: 'Voter ID',
            exampleFormat: '1234567890123456789',
        },
    },
    gh: {
        drivers_license: {
            newDisplayName: '',
            exampleFormat: 'B1234567',
        },
        national_id: {
            newDisplayName: 'National ID',
            exampleFormat: 'GHA-123456789-1',
        },
        passport: {
            newDisplayName: 'Passport',
            exampleFormat: 'G1234567',
        },
        ssnit: {
            newDisplayName: 'Social Security and National Insurance Trust',
            exampleFormat: 'C123456789012',
        },
        voter_id: {
            newDisplayName: 'Voter ID',
            exampleFormat: '01234567890',
        },
    },
    br: {
        cpf: {
            newDisplayName: 'CPF',
            exampleFormat: '123.456.789-12',
        },
    },
    ug: {
        national_id: {
            newDisplayName: 'National ID',
            exampleFormat: 'CM12345678PE1D',
        },
        national_id_no_photo: {
            newDisplayName: 'National ID (No Photo)',
            exampleFormat: 'CM12345678PE1D',
            additionalDocumentExampleFormat: '0123456789',
        },
    },
    zw: {
        national_id: {
            newDisplayName: 'National ID',
            exampleFormat: '081234567F53',
        },
    },
    cl: {
        national_id: {
            exampleFormat: '123456789',
        },
    },
    ar: {
        dni: {
            exampleFormat: '12345678',
        },
    },
    mx: {
        curp: {
            exampleFormat: 'ABCD123456HEFGIJ00',
        },
    },
    id: {
        nik: {
            exampleFormat: '1234567890123456',
        },
    },
    in: {
        aadhaar: {
            exampleFormat: '123456789012',
            additionalDocumentExampleFormat: 'ABCDE1234F',
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
            exampleFormat: 'A1234567',
            additionalDocumentExampleFormat: 'AB1234567890123',
        },
    },
    pe: {
        national_id: {
            exampleFormat: '12345678',
        },
    },
    vn: {
        national_id: {
            exampleFormat: '12345678901',
        },
    },
};
