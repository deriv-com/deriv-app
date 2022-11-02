import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentCard from '../payment-agent-card';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ExpansionPanel: () => <div>ExpansionPanel</div>,
}));

describe('<PaymentAgentCard />', () => {
    it('should render PaymentAgentCard component with ExpansionPanel', () => {
        const payment_agent = {
            urls: [{ url: '' }],
            name: '',
            further_information: '',
            supported_banks: [{ payment_method: '' }],
        };
        render(<PaymentAgentCard payment_agent={payment_agent} />);

        expect(screen.getByText('ExpansionPanel')).toBeInTheDocument();
    });
});
