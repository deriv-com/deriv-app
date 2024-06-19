import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetails from '../order-details';
import { TContractInfo, mockContractInfo } from '@deriv/shared';
import useOrderDetails from 'AppV2/Hooks/useOrderDetails';

jest.mock('AppV2/Hooks/useOrderDetails');

const mock_contract_info: TContractInfo = mockContractInfo({
    contract_id: 1,
});

const mockOrderDetails = {
    details: {
        'Detail 1': 'Value 1',
        'Detail 2': 'Value 2',
        'Detail 3': ['Value 3a', 'Value 3b'],
    },
};

describe('OrderDetails component', () => {
    beforeEach(() => {
        (useOrderDetails as jest.Mock).mockReturnValue(mockOrderDetails);
    });

    it('renders order details correctly', () => {
        render(<OrderDetails contract_info={mock_contract_info} />);

        expect(screen.getByText('Detail 1')).toBeInTheDocument();
        expect(screen.getByText('Value 1')).toBeInTheDocument();

        expect(screen.getByText('Detail 2')).toBeInTheDocument();
        expect(screen.getByText('Value 2')).toBeInTheDocument();

        expect(screen.getByText('Detail 3')).toBeInTheDocument();
        expect(screen.getByText('Value 3a')).toBeInTheDocument();
        expect(screen.getByText('Value 3b')).toBeInTheDocument();
    });

    it('renders with empty details', () => {
        (useOrderDetails as jest.Mock).mockReturnValue({ details: {} });

        render(<OrderDetails contract_info={mock_contract_info} />);

        expect(screen.queryByText('Detail 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Value 1')).not.toBeInTheDocument();
    });

    it('handles array values correctly', () => {
        render(<OrderDetails contract_info={mock_contract_info} />);

        expect(screen.getByText('Detail 3')).toBeInTheDocument();
        expect(screen.getByText('Value 3a')).toBeInTheDocument();
        expect(screen.getByText('Value 3b')).toBeInTheDocument();
    });
});
