import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentWithdrawConfirm from '../payment-agent-withdraw-confirm';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

beforeAll(() => {
    const portal_root = document.createElement('div');
    portal_root.setAttribute('id', 'modal_root');
    document.body.appendChild(portal_root);
});

afterEach(cleanup);

describe('<PaymentAgentWithdrawConfirm />', () => {
    const amount = 10;
    const currency = 'BTC';
    const description = 'testDescription';
    const error = {
        code: 'testCode',
        message: 'testMessage',
    };
    const header = 'Please confirm the transaction details in order to complete the withdrawal:';
    const requestPaymentAgentWithdraw = jest.fn();
    const setIsTryWithdrawSuccessful = jest.fn();

    it('component should be rendered', () => {
        render(<PaymentAgentWithdrawConfirm />);

        expect(screen.getByTestId('dt_cashier_wrapper_transfer_confirm')).toBeInTheDocument();
    });

    it('component <Row /> should be rendered when has data', () => {
        render(<PaymentAgentWithdrawConfirm />);

        expect(screen.getByTestId('dt_transfer_confirm_row_0')).toBeInTheDocument();
    });

    it('component <ErrorDialog /> should be rendered when has an error', () => {
        render(<PaymentAgentWithdrawConfirm error={error} />);

        expect(screen.getByText('testMessage')).toBeInTheDocument();
    });

    it('header should be rendered', () => {
        render(<PaymentAgentWithdrawConfirm />);

        expect(screen.getByText(header)).toBeInTheDocument();
    });

    it(`setIsTryWithdrawSuccessful func should be triggered when click on 'Back' button`, () => {
        render(<PaymentAgentWithdrawConfirm setIsTryWithdrawSuccessful={setIsTryWithdrawSuccessful} />);

        const btn = screen.getByText('Back');
        fireEvent.click(btn);
        expect(setIsTryWithdrawSuccessful).toBeCalledTimes(1);
    });

    it(`requestPaymentAgentWithdraw func should be triggered when click on 'Confirm' button`, () => {
        render(
            <PaymentAgentWithdrawConfirm
                amount={amount}
                currency={currency}
                description={description}
                requestPaymentAgentWithdraw={requestPaymentAgentWithdraw}
            />
        );

        const btn = screen.getByText('Confirm');
        fireEvent.click(btn);
        expect(requestPaymentAgentWithdraw).toBeCalledTimes(1);
    });
});
