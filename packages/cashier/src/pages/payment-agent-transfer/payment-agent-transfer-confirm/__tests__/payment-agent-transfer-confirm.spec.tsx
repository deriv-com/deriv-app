import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentTransferConfirm from '../payment-agent-transfer-confirm';

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

describe('<PaymentAgentTransferConfirm />', () => {
    const amount = 10;
    const currency = 'testCurrency';
    const description = 'testDescription';
    const error = {
        code: 'testCode',
        message: 'testMessage',
    };
    const requestPaymentAgentTransfer = jest.fn();
    const setIsTryTransferSuccessful = jest.fn();
    const transfer_to = 'test';

    it('should show proper icon and message', () => {
        render(<PaymentAgentTransferConfirm transfer_to={transfer_to} error={error} />);

        expect(screen.getByTestId('dt_red_warning_icon')).toBeInTheDocument();
        expect(screen.getByText('Check transfer information')).toBeInTheDocument();
    });

    it(`setIsTryTransferSuccessful func should be triggered when click on 'Back' button`, () => {
        render(
            <PaymentAgentTransferConfirm
                setIsTryTransferSuccessful={setIsTryTransferSuccessful}
                transfer_to={transfer_to}
            />
        );

        const btn = screen.getByText('Back');
        fireEvent.click(btn);
        expect(setIsTryTransferSuccessful).toBeCalledTimes(1);
    });

    it(`requestPaymentAgentTransfer func should be triggered if checkbox is enabled and the "Transfer now" button is clicked`, () => {
        render(
            <PaymentAgentTransferConfirm
                amount={amount}
                currency={currency}
                description={description}
                requestPaymentAgentTransfer={requestPaymentAgentTransfer}
                transfer_to={transfer_to}
            />
        );

        const el_checkbox_transfer_consent = screen.getByRole('checkbox');
        fireEvent.click(el_checkbox_transfer_consent);
        const el_btn_transfer_now = screen.getByRole('button', { name: 'Transfer now' });
        fireEvent.click(el_btn_transfer_now);

        expect(requestPaymentAgentTransfer).toBeCalledTimes(1);
    });
});
