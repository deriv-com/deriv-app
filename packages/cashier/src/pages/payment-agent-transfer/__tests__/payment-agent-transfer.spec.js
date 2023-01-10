import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgentTransfer from '../payment-agent-transfer';
import CashierProviders from '../../../cashier-providers';

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
    let history, mockRootStore;

    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        mockRootStore = {
            client: {
                balance: '100',
                is_virtual: false,
            },

            modules: {
                cashier: {
                    payment_agent_transfer: {
                        error: {},
                        is_transfer_successful: false,
                        is_try_transfer_successful: false,
                        onMountPaymentAgentTransfer: jest.fn(),
                        resetPaymentAgentTransfer: jest.fn(),
                    },
                    general_store: {
                        is_cashier_locked: false,
                        is_loading: false,
                        setActiveTab: jest.fn(),
                    },
                },
            },
            ui: {
                is_dark_mode_on: false,
                toggleAccountsDialog: jest.fn(),
            },
        };

        history = createBrowserHistory();
    });

    const renderPaymentAgentTransfer = () => {
        return render(
            <Router history={history}>
                <CashierProviders store={mockRootStore}>
                    <PaymentAgentTransfer />
                </CashierProviders>
            </Router>
        );
    };

    it('should render the component', () => {
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedPaymentAgentTransferForm')).toBeInTheDocument();
    });

    it('should show the virtual component if client is using demo account', () => {
        mockRootStore.client.is_virtual = true;
        renderPaymentAgentTransfer();

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should show the loading component if in loading state', () => {
        mockRootStore.modules.cashier.general_store.is_loading = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should show the cashier locked component if cashier is locked', () => {
        mockRootStore.modules.cashier.general_store.is_cashier_locked = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('should show a popup if there is an error that needs CTA', () => {
        mockRootStore.modules.cashier.payment_agent_transfer.error.is_show_full_page = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedError')).toBeInTheDocument();
    });

    it('should show the no balance component if account has no balance', () => {
        mockRootStore.client.balance = '0';
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedNoBalance')).toBeInTheDocument();
    });

    it('should show the confirmation if validations are passed', () => {
        mockRootStore.modules.cashier.payment_agent_transfer.is_try_transfer_successful = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedPaymentAgentTransferConfirm')).toBeInTheDocument();
    });

    it('should show the receipt if transfer is successful', () => {
        mockRootStore.modules.cashier.payment_agent_transfer.is_transfer_successful = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedPaymentAgentTransferReceipt')).toBeInTheDocument();
    });
});
