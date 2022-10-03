import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { isMobile } from '@deriv/shared';
import CFDPOI from '../cfd-poi';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    ProofOfIdentityContainerForMt5: () => <div>ProofOfIdentityContainerForMt5</div>,
}));

describe('<CFDPOI />', () => {
    let props;

    const ProofOfIdentityContainerForMt5 = 'ProofOfIdentityContainerForMt5';

    beforeEach(() => {
        props = {
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
            addNotificationByKey: jest.fn(),
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
            onCancel: jest.fn(),
            onSave: jest.fn(),
            onSubmit: jest.fn(),
            fetchResidenceList: jest.fn(),
            refreshNotifications: jest.fn(),
            removeNotificationByKey: jest.fn(),
            removeNotificationMessage: jest.fn(),
            routeBackInApp: jest.fn(),
            should_allow_authentication: true,
            value: {
                poi_state: 'unknown',
            },
        };
    });

    it('should render ProofOfIdentityContainerForMt5', () => {
        render(<CFDPOI {...props} />);
        expect(screen.getByText(ProofOfIdentityContainerForMt5)).toBeInTheDocument();
    });
});
