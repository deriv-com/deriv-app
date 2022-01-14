import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import PaymentAgentTransfer from '../payment-agent-transfer';
import CashierLocked from 'Components/Error/cashier-locked';
import Error from 'Components/Error/error';
import PaymentAgentTransferConfirm from 'Components/Confirm/payment-agent-transfer-confirm';
import PaymentAgentTransferReceipt from 'Components/Receipt/payment-agent-transfer-receipt';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/Error/cashier-locked', () => {
    const originalModule = jest.requireActual('Components/Error/cashier-locked');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => 'mock cashier locked'),
    };
});

jest.mock('Components/Error/error', () => {
    const originalModule = jest.requireActual('Components/Error/error');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => 'mock error'),
    };
});

jest.mock('Components/Confirm/payment-agent-transfer-confirm', () => {
    const originalModule = jest.requireActual('Components/Confirm/payment-agent-transfer-confirm');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => 'mock payment agent transfer confirm'),
    };
});

jest.mock('Components/Receipt/payment-agent-transfer-receipt', () => {
    const originalModule = jest.requireActual('Components/Receipt/payment-agent-transfer-receipt');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => 'mock payment agent transfer receipt'),
    };
});

describe('<PaymentAgentTransfer />', () => {
    const history = createBrowserHistory();
    const onMount = jest.fn();
    const onUnMount = jest.fn();
    const setActiveTab = jest.fn();
    const error = {};

    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the component', () => {
        const { container } = render(
            <Router history={history}>
                <PaymentAgentTransfer
                    balance='100'
                    error={error}
                    onMount={onMount}
                    onUnMount={onUnMount}
                    setActiveTab={setActiveTab}
                />
            </Router>
        );

        expect(onMount).toHaveBeenCalled();
        expect(container.firstChild).toHaveClass('payment-agent-transfer-form__container');
    });

    it('should show the virtual component if client is using demo account', () => {
        render(
            <Router history={history}>
                <PaymentAgentTransfer
                    is_virtual
                    balance='100'
                    error={error}
                    onMount={onMount}
                    onUnMount={onUnMount}
                    setActiveTab={setActiveTab}
                />
            </Router>
        );

        expect(
            screen.getByText(/You need to switch to a real money account to use this feature./i)
        ).toBeInTheDocument();
    });

    it('should show the loading component if in loading state', () => {
        const { container } = render(
            <Router history={history}>
                <PaymentAgentTransfer
                    is_loading
                    balance='100'
                    error={error}
                    onMount={onMount}
                    onUnMount={onUnMount}
                    setActiveTab={setActiveTab}
                />
            </Router>
        );

        expect(container.querySelector('.initial-loader')).toBeInTheDocument();
    });

    it('should show the cashier locked component if cashier is locked', () => {
        render(
            <Router history={history}>
                <PaymentAgentTransfer
                    is_cashier_locked
                    balance='100'
                    error={error}
                    onMount={onMount}
                    onUnMount={onUnMount}
                    setActiveTab={setActiveTab}
                />
            </Router>
        );

        expect(CashierLocked).toHaveBeenCalled();
    });

    it('should show a popup if there is an error that needs CTA', () => {
        const cta_error = {
            is_show_full_page: true,
        };

        render(
            <Router history={history}>
                <PaymentAgentTransfer
                    balance='100'
                    error={cta_error}
                    onMount={onMount}
                    onUnMount={onUnMount}
                    setActiveTab={setActiveTab}
                />
            </Router>
        );

        expect(Error).toHaveBeenCalled();
    });

    it('should show the no balance component if account has no balance', () => {
        const { container } = render(
            <Router history={history}>
                <PaymentAgentTransfer
                    balance='0'
                    error={error}
                    onMount={onMount}
                    onUnMount={onUnMount}
                    setActiveTab={setActiveTab}
                />
            </Router>
        );

        expect(container.querySelector('.cashier__no-balance')).toBeInTheDocument();
    });

    it('should show the confirmation if validations are passed', () => {
        render(
            <Router history={history}>
                <PaymentAgentTransfer
                    is_try_transfer_successful
                    balance='100'
                    error={error}
                    onMount={onMount}
                    onUnMount={onUnMount}
                    setActiveTab={setActiveTab}
                />
            </Router>
        );

        expect(PaymentAgentTransferConfirm).toHaveBeenCalled();
    });

    it('should show the receipt if transfer is successful', () => {
        render(
            <Router history={history}>
                <PaymentAgentTransfer
                    is_transfer_successful
                    balance='100'
                    error={error}
                    onMount={onMount}
                    onUnMount={onUnMount}
                    setActiveTab={setActiveTab}
                />
            </Router>
        );

        expect(PaymentAgentTransferReceipt).toHaveBeenCalled();
    });
});
