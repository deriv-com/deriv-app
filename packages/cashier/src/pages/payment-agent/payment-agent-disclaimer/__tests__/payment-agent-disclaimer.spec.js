import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';

describe('<PaymentAgentDisclaimer />', () => {
    it('should show proper text', () => {
        render(<PaymentAgentDisclaimer />);
        expect(screen.getByText('DISCLAIMER')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deriv is not affiliated with any payment agents. Customers deal with payment agents at their sole risk. Customers are advised to check the credentials of payment agents and the accuracy of any information about payment agents (on Deriv or elsewhere) before using their services.'
            )
        ).toBeInTheDocument();
    });
});
