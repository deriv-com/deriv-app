import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TakeProfitHistory from '../take-profit-history';
import { formatDate, formatTime, TContractStore } from '@deriv/shared';
import { FormatUtils } from '@deriv-com/utils';

jest.mock('@deriv/shared', () => ({
    formatDate: jest.fn(),
    formatTime: jest.fn(),
}));

jest.mock('@deriv-com/utils', () => ({
    FormatUtils: {
        formatMoney: jest.fn(),
    },
}));

describe('TakeProfitHistory component', () => {
    const mockHistory: TContractStore['contract_update_history'] = [
        { order_date: 1672531200, display_name: 'Test Item 1', order_amount: '100' }, // 2023-01-01
        { order_date: 1672617600, display_name: 'Test Item 2', order_amount: '200' }, // 2023-01-02
        { order_date: 1672704000, display_name: 'Test Item 3', order_amount: '300' }, // 2023-01-03
        { order_date: 1672790400, display_name: 'Test Item 4', order_amount: '400' }, // 2023-01-04
        { order_date: 1672876800, display_name: 'Test Item 5', order_amount: '500' }, // 2023-01-05
    ];

    beforeEach(() => {
        (formatDate as jest.Mock).mockImplementation(date => new Date(date * 1000).toDateString());
        (formatTime as jest.Mock).mockImplementation(time => new Date(time * 1000).toLocaleTimeString());
        (FormatUtils.formatMoney as jest.Mock).mockImplementation(amount => `$${amount}`);
    });

    it('renders without crashing', () => {
        render(<TakeProfitHistory />);
        expect(screen.getByText('TP & SL history')).toBeInTheDocument();
    });

    it('renders the correct number of history items', () => {
        render(<TakeProfitHistory history={mockHistory.slice(0, 4)} currency='USD' />);
        expect(screen.getAllByText(/Test Item/)).toHaveLength(4);
    });

    it('renders pagination when history items exceed items per page', () => {
        render(<TakeProfitHistory history={mockHistory} currency='USD' />);
        expect(screen.getByRole('button', { name: /2/ })).toBeInTheDocument();
    });

    it('changes page when pagination is clicked', () => {
        render(<TakeProfitHistory history={mockHistory} currency='USD' />);
        fireEvent.click(screen.getByRole('button', { name: /2/ }));
        expect(screen.getByText('Test Item 5')).toBeInTheDocument();
    });

    it('formats date and time correctly', () => {
        render(<TakeProfitHistory history={mockHistory.slice(0, 1)} currency='USD' />);
        expect(formatDate).toHaveBeenCalledWith(1672531200, 'DD MMM YYYY');
        expect(formatTime).toHaveBeenCalledWith(1672531200);
    });

    it('formats money correctly', () => {
        render(<TakeProfitHistory history={mockHistory.slice(0, 1)} currency='USD' />);
        expect(FormatUtils.formatMoney).toHaveBeenCalledWith(Number('100'));
        expect(screen.getByText('$100 USD')).toBeInTheDocument();
    });
});
