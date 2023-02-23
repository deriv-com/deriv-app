import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentCard from '../payment-agent-card';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ExpansionPanel: () => <div>ExpansionPanel</div>,
}));

describe('<PaymentAgentCard />', () => {
    it('should render PaymentAgentCard component with ExpansionPanel', () => {
        render(<PaymentAgentCard />);

        expect(screen.getByText('ExpansionPanel')).toBeInTheDocument();
    });
});
