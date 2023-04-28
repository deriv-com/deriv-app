import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgent from '../payment-agent';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { useCashierLocked } from '@deriv/hooks';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('Pages/payment-agent/payment-agent-list', () => jest.fn(() => 'mockedPaymentAgentList'));
jest.mock('Components/cashier-locked', () => jest.fn(() => 'mockedCashierLocked'));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCashierLocked: jest.fn(() => false),
}));
const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;

const cashier_mock = {
    general_store: {
        setActiveTab: jest.fn(),
    },
    payment_agent: {
        container: 'payment_agent',
        is_withdraw: false,
        active_tab_index: 0,
        setActiveTabIndex: jest.fn(),
    },
};

describe('<PaymentAgent />', () => {
    const renderPaymentAgent = (mock_root_store: ReturnType<typeof mockStore>) => {
        return render(
            <Router history={createBrowserHistory()}>
                <CashierProviders store={mock_root_store}>
                    <PaymentAgent setSideNotes={jest.fn()} />
                </CashierProviders>
            </Router>
        );
    };

    it('should render the payment agent list', () => {
        const mock_root_store = mockStore({
            client: {
                is_virtual: false,
            },
            modules: { cashier: cashier_mock },
        });
        renderPaymentAgent(mock_root_store);

        expect(mock_root_store.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(0);
        expect(screen.getByText('mockedPaymentAgentList')).toBeInTheDocument();
    });

    it('should render the loading component if in loading state', () => {
        const mock_root_store = mockStore({
            client: {
                is_virtual: false,
                is_switching: true,
            },
            modules: { cashier: cashier_mock },
        });
        renderPaymentAgent(mock_root_store);

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should show the virtual component if the client is using demo account', () => {
        const mock_root_store = mockStore({
            client: {
                is_virtual: true,
            },
            modules: { cashier: cashier_mock },
        });
        renderPaymentAgent(mock_root_store);

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should show the cashier locked component if cashier is locked', () => {
        const mock_root_store = mockStore({
            client: {
                is_virtual: false,
            },
            modules: { cashier: cashier_mock },
        });
        mockUseCashierLocked.mockReturnValue(true);
        renderPaymentAgent(mock_root_store);

        expect(screen.getByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('should reset the index on unmount of component', () => {
        const mock_root_store = mockStore({
            client: {
                is_virtual: false,
            },
            modules: { cashier: cashier_mock },
        });
        const { unmount } = renderPaymentAgent(mock_root_store);

        unmount();
        expect(mock_root_store.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(0);
    });

    it('should set the active tab index accordingly', () => {
        const mock_root_store = mockStore({
            client: {
                is_virtual: false,
                verification_code: { payment_agent_withdraw: 'ABCdef' },
            },
            modules: { cashier: cashier_mock },
        });
        renderPaymentAgent(mock_root_store);

        expect(mock_root_store.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(1);
    });
});
