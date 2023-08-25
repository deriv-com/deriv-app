import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgentTransfer from '../payment-agent-transfer';
import CashierProviders from '../../../cashier-providers';
import { useCashierLocked } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';

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

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCashierLocked: jest.fn(() => false),
}));
const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;

const cashier_mock = {
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
};

describe('<PaymentAgentTransfer />', () => {
    let modal_root_el: HTMLDivElement;

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
    });

    const renderPaymentAgentTransfer = (mock_root_store: ReturnType<typeof mockStore>) => {
        return render(
            <Router history={createBrowserHistory()}>
                <CashierProviders store={mock_root_store}>
                    <PaymentAgentTransfer />
                </CashierProviders>
            </Router>
        );
    };

    it('should render the component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '100',
                is_virtual: false,
            },
            modules: { cashier: cashier_mock },
        });
        renderPaymentAgentTransfer(mock_root_store);

        expect(screen.getByText('mockedPaymentAgentTransferForm')).toBeInTheDocument();
    });

    it('should show the virtual component if client is using demo account', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '100',
                is_virtual: true,
            },
            modules: { cashier: cashier_mock },
        });
        renderPaymentAgentTransfer(mock_root_store);

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should show the loading component if in loading state', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '100',
                is_virtual: false,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    general_store: {
                        is_loading: true,
                        setActiveTab: jest.fn(),
                    },
                },
            },
        });
        renderPaymentAgentTransfer(mock_root_store);

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should show the cashier locked component if cashier is locked', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '100',
                is_virtual: false,
            },
            modules: { cashier: cashier_mock },
        });
        mockUseCashierLocked.mockReturnValue(true);
        renderPaymentAgentTransfer(mock_root_store);

        expect(screen.getByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('should show a popup if there is an error that needs CTA', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '100',
                is_virtual: false,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    payment_agent_transfer: {
                        ...cashier_mock.payment_agent_transfer,
                        error: { is_show_full_page: true },
                    },
                },
            },
        });
        renderPaymentAgentTransfer(mock_root_store);

        expect(screen.getByText('mockedError')).toBeInTheDocument();
    });

    it('should show the no balance component if account has no balance', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '0',
                is_virtual: false,
            },
            modules: { cashier: cashier_mock },
        });
        renderPaymentAgentTransfer(mock_root_store);

        expect(screen.getByText('mockedNoBalance')).toBeInTheDocument();
    });

    it('should show the confirmation if validations are passed', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '100',
                is_virtual: false,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    payment_agent_transfer: {
                        ...cashier_mock.payment_agent_transfer,
                        is_try_transfer_successful: true,
                    },
                },
            },
        });
        renderPaymentAgentTransfer(mock_root_store);

        expect(screen.getByText('mockedPaymentAgentTransferConfirm')).toBeInTheDocument();
    });

    it('should show the receipt if transfer is successful', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '100',
                is_virtual: false,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    payment_agent_transfer: {
                        ...cashier_mock.payment_agent_transfer,
                        is_transfer_successful: true,
                    },
                },
            },
        });
        renderPaymentAgentTransfer(mock_root_store);

        expect(screen.getByText('mockedPaymentAgentTransferReceipt')).toBeInTheDocument();
    });
});
