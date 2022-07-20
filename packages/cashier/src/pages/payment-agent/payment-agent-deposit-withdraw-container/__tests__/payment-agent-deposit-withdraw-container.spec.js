import React from 'react';
import { screen, render } from '@testing-library/react';
import PaymentAgentDepositWithdrawContainer from '../payment-agent-deposit-withdraw-container';
import { isMobile } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('Pages/payment-agent/payment-agent-disclaimer', () => () => <div>PaymentAgentDisclaimer</div>);

describe('<PaymentAgentDepositWithdrawContainer />', () => {
    const props = {
        has_payment_agent_search_warning: false,
        is_deposit: true,
        is_search_loading: false,
        is_try_withdraw_successful: false,
        is_withdraw_successful: false,
        onChangePaymentMethod: jest.fn(),
        payment_agent_list: [
            {
                currencies: 'USD',
                deposit_commission: 0,
                email: 'pa@example.com',
                further_information: 'further information CR90000000',
                max_withdrawal: '2000',
                min_withdrawal: '10',
                name: 'Payment Agent of CR90000000',
                paymentagent_loginid: 'CR90000000',
                phones: '+12345678',
                supported_banks: [{ payment_method: 'Visa' }],
                telephone: '+12345678',
                url: 'http://www.pa.com',
                withdrawal_commission: 0,
            },
            {
                currencies: 'USD',
                deposit_commission: 0,
                email: 'pa@example.com',
                further_information: 'further information CR90000002',
                max_withdrawal: '2000',
                min_withdrawal: '10',
                name: 'Payment Agent of CR90000002',
                paymentagent_loginid: 'CR90000002',
                phones: '+12345678',
                supported_banks: [{ payment_method: 'Visa' }, { payment_method: 'Mastercard' }],
                telephone: '+12345678',
                url: 'http://www.pa.com',
                withdrawal_commission: 0,
            },
        ],
        resetPaymentAgent: jest.fn(),
        selected_bank: '',
        supported_banks: [
            { text: 'MasterCard', value: 'mastercard' },
            { text: 'Visa', value: 'visa' },
        ],
        verification_code: 'ABCdef',
    };

    it('should show proper messages, inputs and icons', () => {
        render(<PaymentAgentDepositWithdrawContainer {...props} />);

        expect(
            screen.getByText('Contact your preferred payment agent for payment instructions and make your deposit.')
        ).toBeInTheDocument();
        expect(screen.getByText('All payment methods')).toBeInTheDocument();
        expect(screen.getByText('Payment Agent of CR90000000')).toBeInTheDocument();
        expect(screen.getByText('Further information CR90000000')).toBeInTheDocument();
        expect(screen.getByText('Payment Agent of CR90000002')).toBeInTheDocument();
        expect(screen.getByText('Further information CR90000002')).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_payment_method_icon').length).toBe(2);
        expect(screen.getByPlaceholderText('Search payment agent name')).toBeInTheDocument();
    });

    it('should show PaymentAgentDisclaimer in mobile view', () => {
        isMobile.mockReturnValue(true);
        render(<PaymentAgentDepositWithdrawContainer {...props} />);

        expect(screen.getByText('PaymentAgentDisclaimer')).toBeInTheDocument();
    });

    it('should show search loader when is_search_loading equal to true', () => {
        render(<PaymentAgentDepositWithdrawContainer {...props} is_search_loading />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show proper warning messages if there are no matches in search results', () => {
        render(<PaymentAgentDepositWithdrawContainer {...props} has_payment_agent_search_warning />);

        expect(screen.getByText('No payment agents found for your search')).toBeInTheDocument();
        expect(screen.getByText('Try changing your search criteria.')).toBeInTheDocument();
    });
});
