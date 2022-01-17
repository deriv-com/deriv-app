import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgent from '../payment-agent';
import PaymentAgentList from 'Components/payment-agent-list';
import CashierLocked from 'Components/Error/cashier-locked';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/payment-agent-list', () => {
    const originalModule = jest.requireActual('Components/payment-agent-list');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => 'mock payment agent list'),
    };
});

jest.mock('Components/Error/cashier-locked', () => {
    const originalModule = jest.requireActual('Components/Error/cashier-locked');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => 'mock cashier locked'),
    };
});

describe('<PaymentAgent />', () => {
    const history = createBrowserHistory();
    const setActiveTab = jest.fn();
    const setPaymentAgentActiveTabIndex = jest.fn();

    it('should render the payment agent list', () => {
        render(
            <Router history={history}>
                <PaymentAgent
                    container={'payment_agent'}
                    is_cashier_locked={false}
                    is_payment_agent_withdraw={false}
                    is_switching={false}
                    is_virtual={false}
                    payment_agent_active_tab_index={0}
                    setActiveTab={setActiveTab}
                    setPaymentAgentActiveTabIndex={setPaymentAgentActiveTabIndex}
                    verification_code={''}
                />
            </Router>
        );

        expect(setPaymentAgentActiveTabIndex).toHaveBeenCalledWith(0);
        expect(setActiveTab).toHaveBeenCalledWith('payment_agent');
        expect(PaymentAgentList).toHaveBeenCalled();
    });

    it('should render the loading component if in loading state', () => {
        const { container } = render(
            <Router history={history}>
                <PaymentAgent
                    is_switching
                    setActiveTab={setActiveTab}
                    setPaymentAgentActiveTabIndex={setPaymentAgentActiveTabIndex}
                />
            </Router>
        );

        expect(container.querySelector('.initial-loader')).toBeInTheDocument();
    });

    it('should show the virtual component if the client is using demo account', () => {
        render(
            <Router history={history}>
                <PaymentAgent
                    is_virtual
                    is_payment_agent_withdraw={false}
                    setActiveTab={setActiveTab}
                    setPaymentAgentActiveTabIndex={setPaymentAgentActiveTabIndex}
                />
            </Router>
        );

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should show the cashier locked component if cashier is locked', () => {
        render(
            <Router history={history}>
                <PaymentAgent
                    is_cashier_locked
                    is_payment_agent_withdraw={false}
                    setActiveTab={setActiveTab}
                    setPaymentAgentActiveTabIndex={setPaymentAgentActiveTabIndex}
                />
            </Router>
        );

        expect(CashierLocked).toHaveBeenCalled();
    });

    it('should reset the index on unmount of component', () => {
        const component = render(
            <Router history={history}>
                <PaymentAgent
                    setActiveTab={setActiveTab}
                    setPaymentAgentActiveTabIndex={setPaymentAgentActiveTabIndex}
                />
            </Router>
        );

        component.unmount();
        expect(setPaymentAgentActiveTabIndex).toHaveBeenCalled();
    });

    it('should set the active tab index accordingly', () => {
        render(
            <Router history={history}>
                <PaymentAgent
                    setActiveTab={setActiveTab}
                    setPaymentAgentActiveTabIndex={setPaymentAgentActiveTabIndex}
                    verification_code={'7GbuuVaX'}
                />
            </Router>
        );

        expect(setPaymentAgentActiveTabIndex).toHaveBeenCalledWith(1);
    });
});
