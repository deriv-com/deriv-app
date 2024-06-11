import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PayoutInfo from '../payout-info';
import { TContractInfo } from '@deriv/shared';

describe('PayoutInfo component', () => {
    const mockContractInfo: TContractInfo = {
        longcode: 'This is a test longcode for the contract.',
    };

    it('renders without crashing', () => {
        render(<PayoutInfo contract_info={mockContractInfo} />);
        expect(screen.getByText('How do I earn a payout?')).toBeInTheDocument();
    });

    it('displays the correct contract longcode', () => {
        render(<PayoutInfo contract_info={mockContractInfo} />);
        expect(screen.getByText('This is a test longcode for the contract.')).toBeInTheDocument();
    });

    it('renders with Localize text correctly', () => {
        render(<PayoutInfo contract_info={mockContractInfo} />);
        expect(screen.getByText('How do I earn a payout?')).toBeInTheDocument();
    });

    it('renders CardWrapper component with title', () => {
        render(<PayoutInfo contract_info={mockContractInfo} />);
        expect(screen.getByText('How do I earn a payout?')).toBeInTheDocument();
    });
});
