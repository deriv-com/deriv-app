import { render, screen } from '@testing-library/react';
import React from 'react';
import CFDPOI from '../cfd-poi';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    ProofOfIdentityContainer: () => <div>ProofOfIdentityContainer</div>,
}));

describe('<CFDPOI />', () => {
    const props = {
        authentication_status: {
            document_status: '',
            identity_status: '',
        },
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
                needs_verification: ['identity'],
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
        form_error: undefined,
        index: 0,
        is_loading: false,
        is_switching: false,
        is_virtual: false,
        should_allow_authentication: true,
        height: '',
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
        addNotificationByKey: jest.fn(),
        fetchResidenceList: jest.fn(),
        refreshNotifications: jest.fn(),
        removeNotificationByKey: jest.fn(),
        removeNotificationMessage: jest.fn(),
        routeBackInApp: jest.fn(),
        value: {
            poi_state: 'pending',
        },
    };

    it('should render properly', () => {
        render(<CFDPOI {...props} />);

        expect(screen.getByTestId('dt-cfd-proof-of-identity')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });
});
