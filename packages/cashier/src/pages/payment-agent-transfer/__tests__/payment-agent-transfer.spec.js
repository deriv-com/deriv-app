import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgentTransfer from '../payment-agent-transfer';
import { StoreProvider } from '@deriv/stores';

const mockRootStore = {
    ui: {
        is_dark_mode_on: false,
        toggleAccountsDialog: jest.fn(),
    },
};

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('Components/cashier-locked', () => jest.fn(() => 'mockedCashierLocked'));
jest.mock('Components/error', () => jest.fn(() => 'mockedError'));
jest.mock('Components/no-balance', () => jest.fn(() => 'mockedNoBalance'));
jest.mock('Pages/payment-agent-transfer/payment-agent-transfer-form', () =>
    jest.fn(() => 'mockedPaymentAgentTransferForm')
);
jest.mock('Pages/payment-agent-transfer/payment-agent-transfer-confirm', () =>
    jest.fn(() => 'mockedPaymentAgentTransferConfirm')
);
jest.mock('Pages/payment-agent-transfer/payment-agent-transfer-receipt', () =>
    jest.fn(() => 'mockedPaymentAgentTransferReceipt')
);

describe('<PaymentAgentTransfer />', () => {
    const history = createBrowserHistory();
    const props = {
        balance: '100',
        error: {},
        onMount: jest.fn(),
        onUnMount: jest.fn(),
        setActiveTab: jest.fn(),
    };

    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the component', () => {
        render(<PaymentAgentTransfer {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('mockedPaymentAgentTransferForm')).toBeInTheDocument();
    });

    it('should show the virtual component if client is using demo account', () => {
        render(
            <Router history={history}>
                <PaymentAgentTransfer is_virtual {...props} />
            </Router>,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should show the loading component if in loading state', () => {
        render(<PaymentAgentTransfer is_loading {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should show the cashier locked component if cashier is locked', () => {
        render(<PaymentAgentTransfer is_cashier_locked {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('should show a popup if there is an error that needs CTA', () => {
        const cta_error = {
            is_show_full_page: true,
        };

        render(<PaymentAgentTransfer {...props} error={cta_error} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('mockedError')).toBeInTheDocument();
    });

    it('should show the no balance component if account has no balance', () => {
        render(<PaymentAgentTransfer {...props} balance='0' />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('mockedNoBalance')).toBeInTheDocument();
    });

    it('should show the confirmation if validations are passed', () => {
        render(<PaymentAgentTransfer is_try_transfer_successful {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('mockedPaymentAgentTransferConfirm')).toBeInTheDocument();
    });

    it('should show the receipt if transfer is successful', () => {
        render(<PaymentAgentTransfer is_transfer_successful {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('mockedPaymentAgentTransferReceipt')).toBeInTheDocument();
    });
});
