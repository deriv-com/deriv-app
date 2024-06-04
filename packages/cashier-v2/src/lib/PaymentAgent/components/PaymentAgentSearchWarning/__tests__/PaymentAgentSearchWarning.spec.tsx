import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentSearchWarning from '../PaymentAgentSearchWarning';

describe('PaymentAgentSearchWarning', () => {
    it('should render PaymentAgentSearchWarning', () => {
        render(<PaymentAgentSearchWarning />);

        expect(screen.getByTestId('dt_search_icon')).toBeInTheDocument();
        expect(screen.getByText('No payment agents found for your search')).toBeInTheDocument();
        expect(screen.getByText('Try changing your search criteria.')).toBeInTheDocument();
    });
});
