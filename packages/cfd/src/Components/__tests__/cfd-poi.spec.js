import { render, screen } from '@testing-library/react';
import React from 'react';
import CFDPOI from '../cfd-poi';
import CFDProviders from '../../cfd-providers';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv/account/src/Sections/Verification/ProofOfIdentity/proof-of-identity-container-for-mt5.jsx', () =>
    jest.fn(() => <div>ProofOfIdentityContainerForMt5</div>)
);

describe('<CFDPOI />', () => {
    let props;
    let mockRootStore;

    beforeEach(() => {
        mockRootStore = {
            client: {
                account_status: {
                    authentication: {
                        attempts: { count: 0, history: {}, latest: null },
                        identity: {
                            services: { idv: {}, manual: {}, onfido: {} },
                            status: 'none',
                        },
                        document: {
                            status: 'none',
                        },
                        needs_verification: [],
                        ownership: { requests: [], status: 'none' },
                    },
                    currency_config: {
                        USD: {
                            is_deposit_suspended: 0,
                            is_withdrawal_suspended: 0,
                        },
                    },
                    prompt_client_to_authenticate: 0,
                    risk_classification: 'low',
                    status: [
                        'allow_document_upload',
                        'crs_tin_information',
                        'deposit_attempt',
                        'financial_information_not_complete',
                        'trading_experience_not_complete',
                    ],
                },
                is_switching: false,
                is_virtual: false,
                should_allow_authentication: true,
                fetchResidenceList: jest.fn(),
            },
            common: {
                routeBackInApp: jest.fn(),
                app_routing_history: [
                    {
                        action: 'POP',
                        hash: '#real',
                        pathname: '/mt5',
                        search: '',
                        state: undefined,
                    },
                    {
                        action: 'PUSH',
                        hash: '',
                        pathname: '/',
                        search: '',
                        state: undefined,
                    },
                ],
            },
            notifications: {
                refreshNotifications: jest.fn(),
            },
        };

        props = {
            addNotificationByKey: jest.fn(),
            authentication_status: {
                document_status: '',
                identity_status: '',
            },
            form_error: undefined,
            height: 'auto',
            index: 1,
            is_loading: false,
            is_switching: false,
            is_virtual: false,
            is_eu_user: false,
            onCancel: jest.fn(),
            onSave: jest.fn(),
            onSubmit: jest.fn(),
            removeNotificationByKey: jest.fn(),
            removeNotificationMessage: jest.fn(),
            value: {
                poi_state: 'unknown',
            },
        };
    });

    it('should render ProofOfIdentityContainerForMt5', () => {
        render(<CFDPOI {...props} />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
        });
        expect(screen.getByText('ProofOfIdentityContainerForMt5')).toBeInTheDocument();
    });
});
