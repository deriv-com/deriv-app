import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentList from '../payment-agent-list';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { isMobile } from '@deriv/shared';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/Error/error', () => () => <div>PaymentAgentWithdrawError</div>);
jest.mock('Components/Email/email-sent', () => () => <div>The email has been sent!</div>);
jest.mock('Components/Form/payment-agent-withdraw-form', () => () => <div>Payment agent withdraw form</div>);

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(() => false),
}));

describe('<PaymentAgentList />', () => {
    const props = {
        is_email_sent: true,
        is_loading: false,
        is_payment_agent_withdraw: false,
        payment_agent_active_tab_index: 0,
        payment_agent_list: [
            {
                email: 'mb+pa1@binary.com',
                name: 'Ms QA script mbpaULOta',
                phones: '+62417576632',
                supported_banks: 'cash',
                urls: 'https://www.payagent.com',
            },
            {
                email: 'pr+cr1@deriv.com',
                name: 'Ms QA script prcrFDQ',
                phones: '+62417597718',
                supported_banks: 'paypal,hsbc',
                urls: 'https://deriv.com/',
            },
            {
                email: 'pr+cr1@binary.com',
                name: 'Ms QA script prcrfWn',
                phones: '+62417511398',
                supported_banks: 'paypal,hsbc',
                urls: 'https://deriv.com/',
            },
        ],
        supported_banks: [
            { text: 'cash', value: 'cash' },
            { text: 'paypal', value: 'paypal' },
        ],
        verification_code: '',
        onChangePaymentMethod: jest.fn(),
        onMount: jest.fn(),
    };

    let history;
    const renderWithRouter = component => {
        history = createBrowserHistory();
        return render(<Router history={history}>{component}</Router>);
    };

    it('should show proper messages, tabs and titles in Deposit tab', () => {
        renderWithRouter(<PaymentAgentList {...props} />);

        expect(
            screen.getByText(
                'A payment agent is authorised to process deposits and withdrawals for you if your local payment methods or currencies are not supported on Deriv.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getAllByRole('listitem').find(listitem => listitem.textContent === 'Deposit')
        ).toBeInTheDocument();
        expect(
            screen.getAllByRole('listitem').find(listitem => listitem.textContent === 'Withdrawal')
        ).toBeInTheDocument();
        expect(screen.getByText('Payment agents')).toBeInTheDocument();
        expect(screen.getByText('Choose a payment agent and contact them for instructions.')).toBeInTheDocument();
        expect(screen.getByText('Ms QA script mbpaULOta')).toBeInTheDocument();
        expect(screen.getByText('Ms QA script prcrFDQ')).toBeInTheDocument();
        expect(screen.getByText('Ms QA script prcrfWn')).toBeInTheDocument();
        expect(screen.getByText('DISCLAIMER')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deriv is not affiliated with any Payment Agent. Customers deal with Payment Agents at their sole risk. Customers are advised to check the credentials of Payment Agents, and check the accuracy of any information about Payments Agents (on Deriv or elsewhere) before transferring funds.'
            )
        ).toBeInTheDocument();
    });

    it('should show loader in Deposit tab', () => {
        renderWithRouter(<PaymentAgentList {...props} is_loading />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should trigger onChange callback when the user selects payment agent from the list in Mobile mode', () => {
        isMobile.mockReturnValue(true);
        renderWithRouter(<PaymentAgentList {...props} />);

        const select_native = screen.getByRole('combobox');
        fireEvent.change(select_native, {
            target: {
                value: 'paypal',
            },
        });

        expect(props.onChangePaymentMethod).toHaveBeenCalledTimes(1);
    });

    it('should show withdrawal error message in Withdrawal tab', () => {
        const error = {
            code: 'error code',
            onClickButton: jest.fn(),
        };

        renderWithRouter(<PaymentAgentList {...props} error={error} payment_agent_active_tab_index={1} />);

        expect(screen.getByText('PaymentAgentWithdrawError')).toBeInTheDocument();
    });

    it('should show "The email has been sent!" message in Withdrawal tab', () => {
        renderWithRouter(<PaymentAgentList {...props} payment_agent_active_tab_index={1} />);

        expect(screen.getByText('The email has been sent!')).toBeInTheDocument();
    });

    it('should show "Payment agent withdraw form" message in Withdrawal tab', () => {
        renderWithRouter(
            <PaymentAgentList
                {...props}
                is_email_sent={false}
                is_payment_agent_withdraw
                payment_agent_active_tab_index={1}
                verification_code='1234'
            />
        );

        expect(screen.getByText('Payment agent withdraw form')).toBeInTheDocument();
    });
});
