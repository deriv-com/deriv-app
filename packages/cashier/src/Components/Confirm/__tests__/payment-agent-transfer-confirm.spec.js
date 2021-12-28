import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentTransferConfirm from '../payment-agent-transfer-confirm';
import Confirm from '../../confirm';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

beforeAll(() => {
    const portalRoot = global.document.createElement('div');
    portalRoot.setAttribute('id', 'modal_root');
    global.document.body.appendChild(portalRoot);
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
    const transfer_to = 'test';
    const requestPaymentAgentTransfer = jest.fn();
    const setIsTryTransferSuccessful = jest.fn();
    const header = 'Please confirm the transaction details in order to complete the transfer:';

    const data = [
        {
            label: 'testText',
            value: transfer_to,
            key: 'testKey',
        },
    ];

    it('component should be rendered', () => {
        const { container } = render(
            <PaymentAgentTransferConfirm transfer_to={transfer_to}>
                <Confirm />
            </PaymentAgentTransferConfirm>
        );

        expect(container.querySelector('.cashier__wrapper--confirm')).toBeInTheDocument();
    });

    it('component <Row /> should be rendered when has data', () => {
        const { container } = render(
            <PaymentAgentTransferConfirm transfer_to={transfer_to}>
                <Confirm data={data} />
            </PaymentAgentTransferConfirm>
        );

        expect(container.querySelector('.confirm__row')).toBeInTheDocument();
    });

    it('component <FormError /> should be rendered when has an error', () => {
        render(
            <PaymentAgentTransferConfirm transfer_to={transfer_to} error={error}>
                <Confirm data={data} error={error} />
            </PaymentAgentTransferConfirm>
        );

        expect(screen.getByText('testMessage')).toBeInTheDocument();
    });

    it('header should be rendered', () => {
        render(
            <PaymentAgentTransferConfirm transfer_to={transfer_to}>
                <Confirm header={header} />
            </PaymentAgentTransferConfirm>
        );

        expect(screen.getByText(header)).toBeInTheDocument();
    });

    it(`setIsTryTransferSuccessful func should be triggered when click on 'Back' button`, () => {
        render(
            <PaymentAgentTransferConfirm
                transfer_to={transfer_to}
                setIsTryTransferSuccessful={setIsTryTransferSuccessful}
            >
                <Confirm
                    onClickBack={() => {
                        setIsTryTransferSuccessful(false);
                    }}
                />
            </PaymentAgentTransferConfirm>
        );

        const btn = screen.getByText('Back');
        fireEvent.click(btn);
        expect(setIsTryTransferSuccessful).toBeCalledTimes(1);
    });

    it(`requestPaymentAgentTransfer func should be triggered when click on 'Confirm' button`, () => {
        render(
            <PaymentAgentTransferConfirm
                amount={amount}
                currency={currency}
                description={description}
                transfer_to={transfer_to}
                requestPaymentAgentTransfer={requestPaymentAgentTransfer}
            >
                <Confirm
                    onClickConfirm={() => {
                        requestPaymentAgentTransfer({ amount, currency, description, transfer_to });
                    }}
                />
            </PaymentAgentTransferConfirm>
        );

        const btn = screen.getByText('Confirm');
        fireEvent.click(btn);
        expect(requestPaymentAgentTransfer).toBeCalledTimes(1);
    });
});
