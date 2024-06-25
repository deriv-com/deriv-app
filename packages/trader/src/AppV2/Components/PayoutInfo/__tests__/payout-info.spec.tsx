import React from 'react';
import { render, screen } from '@testing-library/react';
import PayoutInfo from '../payout-info';
import { TContractInfo, mockContractInfo } from '@deriv/shared';

describe('PayoutInfo component', () => {
    const mock_contract_info: TContractInfo = mockContractInfo({
        longcode: 'This is a test longcode for the contract.',
    });

    it('renders without crashing', () => {
        render(<PayoutInfo contract_info={mock_contract_info} />);
        expect(screen.getByText('How do I earn a payout?')).toBeInTheDocument();
    });

    it('displays the correct contract longcode', () => {
        render(<PayoutInfo contract_info={mock_contract_info} />);
        expect(screen.getByText('This is a test longcode for the contract.')).toBeInTheDocument();
    });

    it('renders with Localize text correctly', () => {
        render(<PayoutInfo contract_info={mock_contract_info} />);
        expect(screen.getByText('How do I earn a payout?')).toBeInTheDocument();
    });

    it('renders CardWrapper component with title', () => {
        render(<PayoutInfo contract_info={mock_contract_info} />);
        expect(screen.getByText('How do I earn a payout?')).toBeInTheDocument();
    });
});
