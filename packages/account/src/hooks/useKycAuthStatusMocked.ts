import { TSocketRequestPayload } from '../../../api/types';

type TKycAuthStatusPayload = TSocketRequestPayload<'kyc_auth_status'>['payload'];

/** Custom hook that returns Proof of Identity (POI) and Proof of Address (POA) authentication status details. */
export const useKycAuthStatusMocked = (payload: TKycAuthStatusPayload) => {
    const argentina_data = {
        kyc_auth_status: {
            address: {},
            identity: {
                service: 'none',
                status: 'none',
                available_services: ['idv', 'onfido', 'manual'],
                last_rejected: {},
                expired_at_uploading: 0,
                supported_documents: [
                    {
                        document_type: 'driving_licence',
                        display_name: 'Driving Licence',
                        format: '.*',
                        example_format: 'ABCD1234',
                        has_expiry_date: true,
                        sides: ['front', 'back'],
                        available_services: ['onfido', 'manual'],
                    },
                    {
                        document_type: 'passport',
                        display_name: 'Passport',
                        format: '.*',
                        example_format: 'ABCD1234',
                        has_expiry_date: true,
                        sides: ['front'],
                        available_services: ['onfido', 'manual'],
                    },
                    {
                        document_type: 'national_id',
                        display_name: 'National Identity Card',
                        format: '^\\d{7,8}$',
                        example_format: '1234567',
                        has_expiry_date: true,
                        sides: ['front'],
                        available_services: ['idv', 'onfido', 'manual'],
                    },
                ],
            },
            risk_classification: 'low',
        },
    };

    const nigeria_data = {
        kyc_auth_status: {
            address: {},
            identity: {
                service: 'none',
                status: 'none',
                available_services: ['idv', 'onfido', 'manual'],
                last_rejected: {},
                expired_at_uploading: 0,
                supported_documents: [
                    {
                        document_type: 'driving_licence',
                        display_name: 'Driving Licence',
                        format: '.*',
                        example_format: 'ABCD1234',
                        has_expiry_date: true,
                        sides: ['front', 'back'],
                        available_services: ['idv', 'onfido', 'manual'],
                    },
                    {
                        document_type: 'passport',
                        display_name: 'Passport',
                        format: '.*',
                        example_format: 'ABCD1234',
                        has_expiry_date: true,
                        sides: ['front'],
                        available_services: ['onfido', 'manual'],
                    },
                    {
                        document_type: 'nimc_slip',
                        display_name: 'NIMC Slip',
                        format: '^[+-]?\\d{0,4}',
                        example_format: '1234',
                        has_expiry_date: false,
                        sides: ['front'],
                        additional: {
                            document_type: 'birth_certificate',
                            display_name: 'Birth Certificate',
                            sides: ['front'],
                        },
                        available_services: ['manual'],
                    },
                ],
            },
            risk_classification: 'low',
        },
    };

    const india_data = {
        kyc_auth_status: {
            address: {},
            identity: {
                service: 'none',
                status: 'none',
                available_services: ['idv', 'onfido', 'manual'],
                last_rejected: {},
                expired_at_uploading: 0,
                supported_documents: [
                    {
                        document_type: 'aadhaar',
                        display_name: 'Aadhaar Card',
                        format: '^[0-9]{12}$',
                        example_format: '123456789012',
                        has_expiry_date: false,
                        additional: {
                            document_type: 'pan_card',
                            display_name: 'PAN Card',
                            format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
                            example_format: 'ABCDE1234F',
                        },
                        available_services: ['idv'],
                    },
                ],
            },
            risk_classification: 'low',
        },
    };

    const iran_data = {
        kyc_auth_status: {
            risk_classification: 'high',
            address: {
                status: 'pending',
                supported_documents: [
                    'utility_bill',
                    'phone_bill',
                    'bank_statement',
                    'affidavit',
                    'official_letter',
                    'rental_agreement',
                    'poa_others',
                ],
            },
            identity: {
                last_rejected: {
                    service: 'idv',
                    document_type: 'driving_licence',
                    rejected_reasons: ['NameMismatch'],
                    report_available: 0,
                },
                available_services: ['idv', 'onfido'],
                expired_at_uploading: 0,
                service: 'none',
                status: 'rejected',
                supported_documents: [
                    {
                        displayName: 'Driving Licence',
                        id: 'driving_licence',
                        example_format: 'Abcd1234',
                        format: '(^[+-]?\\d{0,4})',
                        has_expiry_date: true,
                        documents: [
                            {
                                document_type: 'driving_licence',
                                page_type: 'front',
                            },
                            {
                                document_type: 'driving_licence',
                                page_type: 'back',
                            },
                        ],
                        available_services_supported: ['onfido', 'manual'],
                        additional_document_number: {
                            displayName: 'Driving Licence',
                            example_format: 'Abcd1234',
                            format: '(^[+-]?\\d{0,4})',
                        },
                    },
                    {
                        displayName: 'NIMC Slip',
                        id: 'nimc_slip',
                        example_format: 'Abcd1234',
                        format: '(^[+-]?\\d{0,4})',
                        has_expiry_date: false,
                        documents: [
                            {
                                document_type: 'nimc_slip',
                                page_type: 'front',
                            },
                            {
                                document_type: 'birth_certificate',
                                page_type: 'photo',
                            },
                        ],
                        available_services_supported: ['manual'],
                        additional_document_number: {
                            displayName: 'NIMC Slip',
                            example_format: 'Abcd1234',
                            format: '(^[+-]?\\d{0,4})',
                        },
                    },
                ],
            },
        },
    };
    const data_for_specific_country = {
        ir: iran_data,
        ng: nigeria_data,
        in: india_data,
        ar: argentina_data,
    };

    const general_data = {
        kyc_auth_status: {
            risk_classification: 'high',
            address: {
                status: 'none',
                supported_documents: [
                    'utility_bill',
                    'phone_bill',
                    'bank_statement',
                    'affidavit',
                    'official_letter',
                    'rental_agreement',
                    'poa_others',
                ],
            },
            identity: {
                last_rejected: {},
                available_services: ['idv', 'manual', 'onfido'],
                expired_at_uploading: 0,
                service: 'none',
                status: 'none',
            },
        },
    };

    const data = payload?.country
        ? data_for_specific_country[payload.country as keyof typeof data_for_specific_country]
        : general_data;

    return {
        /** The KYC auth status */
        kyc_auth_status: data?.kyc_auth_status,
    };
};

// indonesia => idv
// x
