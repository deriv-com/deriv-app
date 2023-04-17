import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorCardBody from '../accumulator-card-body';

type TAccumulatorCardBody = React.ComponentProps<typeof AccumulatorCardBody>;

describe('<AccumulatorCardBody />', () => {
    const mock_props: TAccumulatorCardBody = {
        contract_info: {
            buy_price: 123,
            sell_price: 234,
            profit: 111,
            contract_id: 12345,
            is_valid_to_sell: 1,
            status: 'sold',
            is_settleable: 1,
            is_expired: 1,
        },
        contract_update: {
            take_profit: {
                order_amount: 300,
            },
        },
        getCardLabels: () => ({
            CURRENT_STAKE: 'Current stake:',
            STAKE: 'Stake:',
            TAKE_PROFIT: 'Take profit:',
            TOTAL_PROFIT_LOSS: 'Total profit/loss:',
        }),
        is_sold: 1,
        status: 'profit',
        currency: 'USD',
    };
    it('should display Take profit: label and - as value when take_profit is not available', () => {
        if (mock_props?.contract_update?.take_profit?.order_amount)
            mock_props.contract_update.take_profit.order_amount = null;
        render(<AccumulatorCardBody {...mock_props} />);
        expect(screen.getByText('Take profit:')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should display all contract card items, label, and values', () => {
        render(<AccumulatorCardBody {...mock_props} />);
        expect(screen.getByText('Stake:')).toBeInTheDocument();
        expect(screen.getByText('123.00')).toBeInTheDocument();
        expect(screen.getByText('Current stake:')).toBeInTheDocument();
        expect(screen.getByText('234.00')).toBeInTheDocument();
        expect(screen.getByText('Total profit/loss:')).toBeInTheDocument();
        expect(screen.getByText('111.00')).toBeInTheDocument();
        expect(screen.getByText('Take profit:')).toBeInTheDocument();
        expect(screen.getByText('300.00')).toBeInTheDocument();
    });
});
