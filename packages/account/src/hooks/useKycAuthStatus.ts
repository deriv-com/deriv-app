import { useQuery } from '@deriv/api';
import { TSocketRequestPayload } from '@deriv/api/types';
import { useStore } from '@deriv/stores';

type TKycAuthStatusPayload = TSocketRequestPayload<'kyc_auth_status'>['payload'];

/** Custom hook that returns Proof of Identity (POI) and Proof of Address (POA) authentication status details. */
export const useKycAuthStatus = (payload?: TKycAuthStatusPayload, debug = false) => {
    const { client } = useStore();

    const { is_authorize } = client;
    const { data, ...kyc_auth_status_rest } = useQuery('kyc_auth_status', {
        payload,
        options: { enabled: is_authorize },
    });

    const mockedResponse = {
        general: {
            address: {},
            identity: {
                available_services: ['idv', 'onfido', 'manual'],
                last_rejected: {},
                service: 'none',
                status: 'none',
                expired_at_uploading: 0,
                risk_classification: 'low',
            },
        },
        ar: {
            address: {},
            identity: {
                service: 'none',
                status: 'none',
                last_rejected: {},
                expired_at_uploading: 0,
                available_services: ['idv', 'onfido', 'manual'],
                supported_documents: [
                    {
                        document_type: 'driving_licence',
                        display_name: 'Driving Licence',
                        format: '.*',
                        example_format: 'ABCD1234',
                        lifetime_valid: false,
                        sides: ['front', 'back'],
                        available_services: ['onfido', 'manual'],
                    },
                    {
                        document_type: 'passport',
                        display_name: 'Passport',
                        format: '.*',
                        example_format: 'ABCD1234',
                        lifetime_valid: false,
                        sides: ['front'],
                        available_services: ['onfido', 'manual'],
                    },
                    {
                        document_type: 'national_id',
                        display_name: 'National Identity Card',
                        format: '^\\d{7,8}$',
                        example_format: '1234567',
                        lifetime_valid: false,
                        sides: ['front'],
                        available_services: ['idv', 'onfido', 'manual'],
                    },
                ],
            },
            risk_classification: 'low',
        },
    };

    let auth_status = data?.kyc_auth_status;
    if (debug) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        auth_status = payload?.country ? mockedResponse.ar : mockedResponse.general;
    }

    return {
        kyc_auth_status: auth_status,
        ...kyc_auth_status_rest,
    };
};
