import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentCardDescription from '../payment-agent-card-description';
import { TPaymentAgent } from '../../../../types';

describe('<PaymentAgentCardDescription />', () => {
    const mocked_payment_agent: TPaymentAgent = {
        currencies: 'USD',
        deposit_commission: '',
        email: '',
        further_information: 'further information',
        max_withdrawal: '',
        min_withdrawal: '',
        name: 'Payment Agent of CR90000000',
        paymentagent_loginid: '',
        phone_numbers: [],
        summary: '',
        supported_banks: [{ payment_method: 'Visa' }],
        supported_payment_methods: [],
        urls: [{ url: 'https://www.MyPAMyAdventure2.com/' }, { url: 'https://www.MyPAMyAdventure.com/' }],
        withdrawal_commission: '',
    };

    it('should show proper description details and icon', () => {
        render(<PaymentAgentCardDescription payment_agent={mocked_payment_agent} />);

        expect(screen.getByText('Payment Agent of CR90000000')).toBeInTheDocument();
        expect(screen.getByText('Further information')).toBeInTheDocument();
        expect(screen.getByText('https://www.MyPAMyAdventure2.com/,')).toBeInTheDocument();
        expect(screen.getByText('https://www.MyPAMyAdventure.com/')).toBeInTheDocument();
        expect(screen.getByTestId('dt_payment_method_icon')).toBeInTheDocument();
    });

    it('should not show an icon when there is no appropriate icon for payment method', () => {
        render(
            <PaymentAgentCardDescription
                payment_agent={{ ...mocked_payment_agent, supported_banks: [{ payment_method: 'FakePaymentMethod' }] }}
            />
        );

        expect(screen.queryByTestId('dt_payment_method_icon')).not.toBeInTheDocument();
    });
});
