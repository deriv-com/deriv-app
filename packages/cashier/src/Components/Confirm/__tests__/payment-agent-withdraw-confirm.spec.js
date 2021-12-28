import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentWithdrawConfirm from '../payment-agent-withdraw-confirm';
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

describe('<PaymentAgentWithdrawConfirm />', () => {
    const amount = 10;
    const currency = 'testCurrency';
    const description = 'testDescription';
    const payment_agent_name = 'testName';
    const error = {
        code: 'testCode',
        message: 'testMessage',
    };
    // const transfer_to = 'test';
    const requestPaymentAgentWithdraw = jest.fn();
    const setIsTryWithdrawSuccessful = jest.fn();
    const header = 'Please confirm the transaction details in order to complete the withdrawal:';

    const data = [
        {
            label: 'testText',
            value: payment_agent_name,
            key: 'testKey',
        },
    ];

    it('component should be rendered', () => {
        const component = render(<PaymentAgentWithdrawConfirm />);

        expect(component.container.querySelector('.cashier__wrapper--confirm')).toBeInTheDocument();
    });

    it('component <Row /> should be rendered when has data', () => {
        const component = render(
            <PaymentAgentWithdrawConfirm>
                <Confirm data={data} />
            </PaymentAgentWithdrawConfirm>
        );

        expect(component.container.querySelector('.confirm__row')).toBeInTheDocument();
    });

    it('component <FormError /> should be rendered when has an error', () => {
        const component = render(
            <PaymentAgentWithdrawConfirm error={error}>
                <Confirm data={data} error={error} />
            </PaymentAgentWithdrawConfirm>
        );

        expect(screen.getByText('testMessage')).toBeInTheDocument();
    });

    it('header should be rendered', () => {
        render(
            <PaymentAgentWithdrawConfirm>
                <Confirm header={header} />
            </PaymentAgentWithdrawConfirm>
        );

        expect(screen.getByText(header)).toBeInTheDocument();
    });

    it(`setIsTryWithdrawSuccessful func should be triggered when click on 'Back' button`, () => {
        render(
            <PaymentAgentWithdrawConfirm setIsTryWithdrawSuccessful={setIsTryWithdrawSuccessful}>
                <Confirm
                    onClickBack={() => {
                        setIsTryWithdrawSuccessful(false);
                    }}
                />
            </PaymentAgentWithdrawConfirm>
        );

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
            >
                <Confirm
                    onClickConfirm={() => {
                        requestPaymentAgentWithdraw({ amount, currency, description, transfer_to });
                    }}
                />
            </PaymentAgentWithdrawConfirm>
        );

        const btn = screen.getByText('Confirm');
        fireEvent.click(btn);
        expect(requestPaymentAgentWithdraw).toBeCalledTimes(1);
    });
});
