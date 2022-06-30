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
    ProofOfIdentityContainer: () => <div>ProofOfIdentityContainer</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

describe('<CFDPOI />', () => {
    let props;

    beforeEach(() => {
        isMobile.mockReturnValue(false);

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

    it('should render with Next button disabled before submitting POI for the first time', () => {
        render(<CFDPOI {...props} />);

        expect(screen.getByTestId('dt_cfd_proof_of_identity')).toBeInTheDocument();
        expect(screen.getByText('ProofOfIdentityContainer')).toBeInTheDocument();
        expect(screen.getByTestId('dt_modal_footer')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('should render without modal footer wrapper on mobile', () => {
        isMobile.mockReturnValue(true);
        render(<CFDPOI {...props} />);

        expect(screen.getByTestId('dt_cfd_proof_of_identity')).toBeInTheDocument();
        expect(screen.getByText('ProofOfIdentityContainer')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_modal_footer')).not.toBeInTheDocument();
        expect(screen.getAllByRole('button').length).toBe(2);
    });

    it('should trigger onCancel callback when Previous button is clicked', () => {
        render(<CFDPOI {...props} />);

        const previous_button = screen.getByRole('button', { name: /previous/i });

        expect(screen.getByTestId('dt_cfd_proof_of_identity')).toBeInTheDocument();
        expect(previous_button).toBeEnabled();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();

        fireEvent.click(previous_button);
        expect(props.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should enable Next button when identity_status is pending or verified, and disable otherwise', () => {
        props.authentication_status.identity_status = 'pending';
        const { rerender } = render(<CFDPOI {...props} />);

        const next_button = screen.getByRole('button', { name: /next/i });
        expect(next_button).toBeEnabled();

        fireEvent.click(next_button);
        expect(props.onSubmit).toHaveBeenCalledTimes(1);

        props.authentication_status.identity_status = 'verified';
        rerender(<CFDPOI {...props} />);

        expect(next_button).toBeEnabled();

        fireEvent.click(next_button);
        expect(props.onSubmit).toHaveBeenCalledTimes(2);

        props.authentication_status.identity_status = '';
        rerender(<CFDPOI {...props} />);

        expect(next_button).toBeDisabled();
    });

    it('should enable Next button when poi_state has changed to pending as a result of POI submission', () => {
        jest.spyOn(React, 'useState').mockReturnValueOnce(['pending', () => {}]);
        render(<CFDPOI {...props} />);

        const next_button = screen.getByRole('button', { name: /next/i });

        expect(screen.getByTestId('dt_cfd_proof_of_identity')).toBeInTheDocument();
        expect(screen.getByText('ProofOfIdentityContainer')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
        expect(next_button).toBeEnabled();

        fireEvent.click(next_button);
        expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should show an error message received from server that is passed via props as form_error', () => {
        const form_error = 'Form submission failed.';
        render(<CFDPOI {...props} form_error={form_error} />);

        expect(screen.getByText(form_error)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });
});
