import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractHistory from '../contract-history';

const mocked_default_props = {
    currency: 'test_currency',
};
const mock_history = [
    {
        display_name: 'test_name',
        order_amount: '-123',
        order_date: 123,
        order_type: 'test_order_type',
        value: 'test_value',
    },
];

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => <div>test_icon</div>),
}));
jest.mock('../contract-audit-item', () => jest.fn(props => <div data-testid={props.value}>ContractAuditItem</div>));

describe('<ContractHistory />', () => {
    it('should render special message if history.length === 0', () => {
        render(<ContractHistory {...mocked_default_props} />);

        expect(screen.getByText(/test_icon/i)).toBeInTheDocument();
        expect(screen.getByText(/No history/i)).toBeInTheDocument();
        expect(screen.getByText(/You have yet to update either take profit or stop loss/i)).toBeInTheDocument();
    });

    it('should render ContractAuditItem if history.length !== 0', () => {
        render(<ContractHistory {...mocked_default_props} history={mock_history} />);

        expect(screen.getByText(/ContractAuditItem/i)).toBeInTheDocument();
    });

    it('should render Cancelled if order_amount is 0', () => {
        mock_history[0].order_amount = '0';
        render(<ContractHistory {...mocked_default_props} history={mock_history} />);

        expect(screen.getByTestId(/Cancelled/i)).toBeInTheDocument();
    });
});
