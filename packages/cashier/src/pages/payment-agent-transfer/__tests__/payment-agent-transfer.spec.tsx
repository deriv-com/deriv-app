import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgentTransfer from '../payment-agent-transfer';
import CashierProviders from '../../../cashier-providers';
import { useCashierLocked } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => 'mockedLoading'),
}));
jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCashierLocked: jest.fn(() => false),
}));
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

const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;

describe('<PaymentAgentTransfer />', () => {
    let modal_root_el: HTMLDivElement, mockRootStore: ReturnType<typeof mockStore>;

    const renderPaymentAgentTransfer = () => {
        return render(<PaymentAgentTransfer />, {
            wrapper: ({ children }) => (
                <Router history={createBrowserHistory()}>
                    <CashierProviders store={mockRootStore}>{children}</CashierProviders>
                </Router>
            ),
        });
    };

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        mockUseCashierLocked.mockReturnValue(false);
        mockRootStore = mockStore({
            client: {
                balance: '100',
                is_virtual: false,
                is_authorize: true,
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
                        is_loading: false,
                        setActiveTab: jest.fn(),
                    },
                },
            },
        });
    });

    it('renders the component', () => {
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedPaymentAgentTransferForm')).toBeInTheDocument();
    });

    it('shows the virtual component if client is using demo account', () => {
        mockRootStore.client.is_virtual = true;
        renderPaymentAgentTransfer();

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('shows the loading component if in loading state', () => {
        mockRootStore.modules.cashier.general_store.is_loading = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('shows the cashier locked component if cashier is locked', () => {
        mockUseCashierLocked.mockReturnValue(true);
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('shows a popup if there is an error that needs CTA', () => {
        mockRootStore.modules.cashier.payment_agent_transfer.error.is_show_full_page = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedError')).toBeInTheDocument();
    });

    it('shows the no balance component if account has no balance', () => {
        mockRootStore.client.balance = '0';
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedNoBalance')).toBeInTheDocument();
    });

    it('shows the confirmation if validations are passed', () => {
        mockRootStore.modules.cashier.payment_agent_transfer.is_try_transfer_successful = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedPaymentAgentTransferConfirm')).toBeInTheDocument();
    });

    it('shows the receipt if transfer is successful', () => {
        mockRootStore.modules.cashier.payment_agent_transfer.is_transfer_successful = true;
        renderPaymentAgentTransfer();

        expect(screen.getByText('mockedPaymentAgentTransferReceipt')).toBeInTheDocument();
    });
});
