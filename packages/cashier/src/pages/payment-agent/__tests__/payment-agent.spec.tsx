import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgent from '../payment-agent';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { useCashierLocked } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCashierLocked: jest.fn(() => false),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div>Loading</div>),
}));
jest.mock('Pages/payment-agent/payment-agent-list', () => {
    const PaymentAgentList = () => <div>PaymentAgentList</div>;
    return PaymentAgentList;
});
jest.mock('Components/cashier-locked', () => {
    const CashierLocked = () => <div>CashierLocked</div>;
    return CashierLocked;
});

describe('<PaymentAgent />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;

    const renderPaymentAgent = () => {
        return render(<PaymentAgent />, {
            wrapper: ({ children }) => (
                <Router history={createBrowserHistory()}>
                    <CashierProviders store={mockRootStore}>{children}</CashierProviders>
                </Router>
            ),
        });
    };

    beforeEach(() => {
        (useCashierLocked as jest.Mock).mockReturnValue(false);

        mockRootStore = mockStore({
            client: {
                is_switching: false,
                is_virtual: false,
                is_authorize: true,
            },
            modules: {
                cashier: {
                    general_store: {
                        setActiveTab: jest.fn(),
                    },
                    payment_agent: {
                        container: 'payment_agent',
                        is_withdraw: false,
                        active_tab_index: 0,
                        setActiveTabIndex: jest.fn(),
                    },
                },
            },
        });
    });

    it('renders the payment agent list', () => {
        renderPaymentAgent();

        expect(mockRootStore.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(0);
        expect(screen.getByText('PaymentAgentList')).toBeInTheDocument();
    });

    it('renders the loading component if in loading state', () => {
        mockRootStore.client.is_switching = true;
        renderPaymentAgent();

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('shows the virtual component if the client is using demo account', () => {
        mockRootStore.client.is_virtual = true;
        renderPaymentAgent();

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('shows the cashier locked component if cashier is locked', () => {
        (useCashierLocked as jest.Mock).mockReturnValue(true);

        renderPaymentAgent();

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('resets the index on unmount of component', () => {
        const { unmount } = renderPaymentAgent();
        unmount();

        expect(mockRootStore.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(0);
    });

    it('sets the active tab index accordingly', () => {
        mockRootStore.client.verification_code.payment_agent_withdraw = 'ABCdef';
        renderPaymentAgent();

        expect(mockRootStore.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(1);
    });
});
