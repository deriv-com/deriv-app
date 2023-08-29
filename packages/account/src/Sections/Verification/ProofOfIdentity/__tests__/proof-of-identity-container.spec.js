import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import ProofOfIdentityContainer from '../proof-of-identity-container';
import { populateVerificationStatus } from '../../Helpers/verification.js';
import { identity_status_codes, service_code } from '../proof-of-identity-utils';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            getAccountStatus: jest.fn().mockResolvedValue({ get_account_status: 1 }),
        },
    },
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => 'mockedLoading'),
}));

jest.mock('onfido-sdk-ui', () => ({
    init: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../Helpers/verification.js', () => ({
    populateVerificationStatus: jest.fn().mockReturnValue({
        is_age_verified: false,
    }),
}));

jest.mock('Components/demo-message', () => jest.fn(() => 'mockedDemoMessage'));
jest.mock('Sections/Verification/ProofOfIdentity/idv.jsx', () => jest.fn(() => 'mockedIDV'));
jest.mock('Sections/Verification/ProofOfIdentity/onfido.jsx', () => jest.fn(() => 'mockedOnfido'));
jest.mock('Sections/Verification/ProofOfIdentity/proof-of-identity-submission.jsx', () =>
    jest.fn(() => 'mockedProofOfIdentitySubmission')
);
jest.mock('Components/poi/status/unsupported', () => jest.fn(() => 'mockedUnsupported'));
jest.mock('Components/poi/status/not-required', () => jest.fn(() => 'mockedNotRequired'));
jest.mock('Components/error-component', () => jest.fn(() => 'mockedErrorMessage'));
jest.mock('Components/poi/status/upload-complete', () => jest.fn(() => 'mockedUploadComplete'));
jest.mock('Components/poi/status/verified', () => jest.fn(() => 'mockedVerified'));
jest.mock('Components/poi/status/limited', () => jest.fn(() => 'mockedLimited'));
jest.mock('Components/poi/status/expired', () => jest.fn(() => 'mockedExpired'));

const mock_props = {
    account_settings: {},
    account_status: {
        authentication: {
            attempts: {
                count: 1,
                history: [
                    {
                        country_code: 'id',
                        id: '8919',
                        service: 'manual',
                        status: 'verified',
                        timestamp: 1674633681,
                    },
                ],
                latest: {
                    country_code: 'id',
                    id: '8919',
                    service: 'manual',
                    status: 'verified',
                    timestamp: 1674633681,
                },
            },
            document: {
                status: 'verified',
            },

            identity: {
                services: {
                    idv: {
                        last_rejected: [],
                        reported_properties: {},
                        status: 'none',
                        submissions_left: 3,
                    },
                    manual: {
                        status: 'none',
                    },
                    onfido: {
                        country_code: 'IDN',
                        documents_supported: [
                            'Driving Licence',
                            'National Identity Card',
                            'Passport',
                            'Residence Permit',
                        ],
                        is_country_supported: 1,
                        last_rejected: [],
                        reported_properties: {},
                        status: 'none',
                        submissions_left: 3,
                    },
                },
                status: 'verified',
            },
            income: {
                status: 'none',
            },
            needs_verification: [],
            ownership: {
                requests: [],
                status: 'none',
            },
        },
        currency_config: {
            USD: {
                is_deposit_suspended: 0,
                is_withdrawal_suspended: 0,
            },
        },
        p2p_status: 'none',
        prompt_client_to_authenticate: 0,
        risk_classification: 'low',
        status: [
            'age_verification',
            'allow_document_upload',
            'authenticated',
            'dxtrade_password_not_set',
            'financial_information_not_complete',
            'idv_disallowed',
            'mt5_password_not_set',
            'trading_experience_not_complete',
        ],
    },
    app_routing_history: [
        {
            pathname: '/account/proof-of-identity',
        },
    ],
    fetchResidenceList: jest.fn().mockResolvedValue({
        residence_list: [],
    }),
    getChangeableFields: [],
    is_from_external: false,
    is_switching: false,
    is_virtual: false,
    is_high_risk: false,
    is_withdrawal_lock: false,
    onStateChange: jest.fn(),
    refreshNotifications: jest.fn(),
    routeBackInApp: jest.fn(),
    should_allow_authentication: false,
    setIsCfdPoiCompleted: jest.fn(),
    updateAccountStatus: jest.fn(),
};

describe('ProofOfIdentityContainer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render proof of identity container with loader', async () => {
        const new_props = {
            ...mock_props,
            is_switching: true,
        };

        render(<ProofOfIdentityContainer {...new_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render message when account is virtual', async () => {
        const new_props = {
            ...mock_props,
            is_virtual: true,
        };

        render(<ProofOfIdentityContainer {...new_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedDemoMessage')).toBeInTheDocument();
    });

    it('should render API error message returned in response', async () => {
        const new_props = {
            ...mock_props,
            fetchResidenceList: jest.fn().mockResolvedValue({
                error: {
                    message: 'API error',
                },
            }),
        };
        render(<ProofOfIdentityContainer {...new_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedErrorMessage')).toBeInTheDocument();
    });

    it('should render messages that POA is not required', async () => {
        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedNotRequired')).toBeInTheDocument();
    });

    it('should render POI submission section when status is none', async () => {
        populateVerificationStatus.mockReturnValue({
            identity_status: identity_status_codes.none,
            is_age_verified: true,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedProofOfIdentitySubmission')).toBeInTheDocument();
    });

    it('should render POI submission section when allow_poi_resubmission is set', async () => {
        populateVerificationStatus.mockReturnValue({
            allow_poi_resubmission: true,
            is_age_verified: true,
            identity_status: identity_status_codes.verified,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedProofOfIdentitySubmission')).toBeInTheDocument();
    });

    it('should render Upload complete section when status is pending', async () => {
        populateVerificationStatus.mockReturnValue({
            identity_last_attempt: null,
            is_age_verified: true,
            identity_status: identity_status_codes.pending,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedUploadComplete')).toBeInTheDocument();
    });

    it('should render Verified section when status is verified', async () => {
        populateVerificationStatus.mockReturnValue({
            identity_last_attempt: null,
            is_age_verified: true,
            identity_status: identity_status_codes.verified,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedVerified')).toBeInTheDocument();
    });

    it('should render Expired section when status is expired', async () => {
        populateVerificationStatus.mockReturnValue({
            identity_last_attempt: null,
            is_age_verified: true,
            identity_status: identity_status_codes.expired,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedExpired')).toBeInTheDocument();
    });

    it('should render Limited section when status is rejected', async () => {
        populateVerificationStatus.mockReturnValue({
            identity_last_attempt: null,
            is_age_verified: true,
            identity_status: identity_status_codes.rejected,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedLimited')).toBeInTheDocument();
    });

    it('should render Onfido section when there was a previous onfido submission', async () => {
        populateVerificationStatus.mockReturnValue({
            identity_last_attempt: { service: service_code.onfido },
            is_age_verified: true,
            identity_status: identity_status_codes.rejected,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedOnfido')).toBeInTheDocument();
    });

    it('should render IDV section when there was a previous IDV submission', async () => {
        populateVerificationStatus.mockReturnValue({
            identity_last_attempt: { service: service_code.idv },
            is_age_verified: true,
            identity_status: identity_status_codes.rejected,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedIDV')).toBeInTheDocument();
    });

    it('should render Manual section when there was a previous manual submission', async () => {
        populateVerificationStatus.mockReturnValue({
            identity_last_attempt: { service: service_code.manual },
            is_age_verified: true,
            identity_status: identity_status_codes.rejected,
        });

        render(<ProofOfIdentityContainer {...mock_props} />);
        await waitFor(() => {});
        expect(screen.getByText('mockedUnsupported')).toBeInTheDocument();
    });
});
