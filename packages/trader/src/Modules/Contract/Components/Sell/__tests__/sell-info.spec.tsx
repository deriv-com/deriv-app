import React from 'react';
import { render, screen } from '@testing-library/react';
import SellInfo from '../sell-info';

const mocked_props = {
    contract_info: { currency: 'USD' },
    sell_info: {
        transaction_id: 'tests_id',
        sell_price: 49.99,
    },
};

describe('SellInfo', () => {
    it('should render component with proper transaction id and a sell price', () => {
        render(<SellInfo {...mocked_props} />);

        expect(screen.getByText(/49.99/i)).toBeInTheDocument();
        expect(screen.getByText(/tests_id/i)).toBeInTheDocument();
    });
});
