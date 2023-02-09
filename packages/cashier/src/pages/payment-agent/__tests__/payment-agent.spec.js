import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgent from '../payment-agent';
import { StoreProvider } from '@deriv/stores';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('Pages/payment-agent/payment-agent-list', () => jest.fn(() => 'mockedPaymentAgentList'));
jest.mock('Components/cashier-locked', () => jest.fn(() => 'mockedCashierLocked'));

describe('<PaymentAgent />', () => {
    let mockRootStore;

    beforeEach(() => {
        mockRootStore = {
            ui: {
                is_dark_mode_on: false,
                toggleAccountsDialog: jest.fn(),
            },
            client: {
                is_switching: false,
                is_virtual: false,
                verification_code: {
                    payment_agent_withdraw: '',
                },
            },
            modules: {
                cashier: {
                    general_store: {
                        is_cashier_locked: false,
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
        };
    });

    const renderPaymentAgent = () => {
        return render(
            <Router history={createBrowserHistory()}>
                <StoreProvider store={mockRootStore}>
                    <PaymentAgent setSideNotes={jest.fn()} />
                </StoreProvider>
            </Router>
        );
    };

    it('should render the payment agent list', () => {
        renderPaymentAgent();

        expect(mockRootStore.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(0);
        expect(screen.getByText('mockedPaymentAgentList')).toBeInTheDocument();
    });

    it('should render the loading component if in loading state', () => {
        mockRootStore.client.is_switching = true;
        renderPaymentAgent();

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should show the virtual component if the client is using demo account', () => {
        mockRootStore.client.is_virtual = true;
        renderPaymentAgent();

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should show the cashier locked component if cashier is locked', () => {
        mockRootStore.modules.cashier.general_store.is_cashier_locked = true;
        renderPaymentAgent();

        expect(screen.getByText('mockedCashierLocked')).toBeInTheDocument();
    });

    it('should reset the index on unmount of component', () => {
        const { unmount } = renderPaymentAgent();

        unmount();
        expect(mockRootStore.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(0);
    });

    it('should set the active tab index accordingly', () => {
        mockRootStore.client.verification_code.payment_agent_withdraw = 'ABCdef';
        renderPaymentAgent();

        expect(mockRootStore.modules.cashier.payment_agent.setActiveTabIndex).toHaveBeenCalledWith(1);
    });
});
