import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentDepositDetails from '../payment-agent-deposit-details';

describe('<PaymentAgentDepositDetails />', () => {
    const mocked_payment_agent = {
        currency: 'USD',
        currencies: 'USD',
        deposit_commission: '10',
        email: 'pa@example.com',
        further_information: '',
        max_withdrawal: '2000',
        min_withdrawal: '10',
        name: '',
        paymentagent_loginid: '',
        phone_numbers: [{ phone_number: '+12345678' }, { phone_number: '+87654321' }],
        summary: '',
        supported_payment_methods: [],
        urls: [],
        withdrawal_commission: '0',
    };

    it('should show proper payment agent deposit details', () => {
        render(<PaymentAgentDepositDetails payment_agent={mocked_payment_agent} />);

        expect(screen.getByText('Phone number')).toBeInTheDocument();
        expect(screen.getByText('+12345678,')).toBeInTheDocument();
        expect(screen.getByText('+87654321')).toBeInTheDocument();
        expect(screen.getByText('Transfer limit')).toBeInTheDocument();
        expect(screen.getByText('10.00 USD')).toBeInTheDocument();
        expect(screen.getByText('2,000.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Commission on deposits')).toBeInTheDocument();
        expect(screen.getByText('10%')).toBeInTheDocument();
        expect(screen.getByText('Commission on withdrawal')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
    });
});
