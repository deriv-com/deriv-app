import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentCard from '../payment-agent-card';
import { TPaymentAgent } from '../../../../types';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ExpansionPanel: () => <div>ExpansionPanel</div>,
}));

describe('<PaymentAgentCard />', () => {
    it('should render PaymentAgentCard component with ExpansionPanel', () => {
        const payment_agent: TPaymentAgent = {
            currencies: 'USD',
            deposit_commission: '',
            email: '',
            further_information: '',
            max_withdrawal: '',
            min_withdrawal: '',
            name: '',
            paymentagent_loginid: '',
            phone_numbers: [],
            summary: '',
            supported_banks: [{ payment_method: '' }],
            supported_payment_methods: [],
            urls: [{ url: '' }],
            withdrawal_commission: '',
        };
        render(<PaymentAgentCard payment_agent={payment_agent} />);

        expect(screen.getByText('ExpansionPanel')).toBeInTheDocument();
    });
});
