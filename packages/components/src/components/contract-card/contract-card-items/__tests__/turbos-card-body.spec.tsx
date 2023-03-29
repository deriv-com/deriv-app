import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';
import TurbosCardBody from '../turbos-card-body';

const contract_info: TContractInfo = {
    contract_id: 1,
    bid_price: 1044.02,
    buy_price: 1044.0,
    profit: 50,
    barrier: '10904.80',
    current_spot_display_value: '1046.80',
    sell_spot: 1046.8,
    entry_spot: 1054,
    is_valid_to_sell: 1,
};

const mockCardLabels = () => ({
    BARRIER_LEVEL: 'Barrier level',
    CURRENT_PRICE: 'Current price',
    STAKE: 'Stake',
    BUY_PRICE: 'Buy price',
    TAKE_PROFIT: 'Take profit',
    TOTAL_PROFIT_LOSS: 'Total profit/loss',
    PAYOUT: 'Payout',
    PROFIT_LOSS: 'Profit/Loss',
    POTENTIAL_PROFIT_LOSS: 'Potential profit/loss',
});

describe('TurbosCardBody', () => {
    const mock_props = {
        addToast: jest.fn(),
        connectWithContractUpdate: jest.fn(),
        contract_info,
        contract_update: {
            take_profit: {
                display_name: 'Take profit',
                order_amount: 0,
                order_date: 1678948046,
            },
        },
        currency: 'USD',
        current_focus: null,
        error_message_alignment: 'left',
        getCardLabels: mockCardLabels,
        getContractById: jest.fn(),
        is_sold: false,
        onMouseLeave: jest.fn(),
        removeToast: jest.fn(),
        setCurrentFocus: jest.fn(),
        status: 'profit',
        progress_slider_mobile_el: false,
    };
    beforeAll(() => {
        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });
    });

    // is_sold = false
    it('renders stake amount correctly', () => {
        render(<TurbosCardBody {...mock_props} />);
        const stake_header = screen.getByText(mockCardLabels().STAKE);
        expect(stake_header).toBeInTheDocument();
        const stake_amount = screen.getByText('1,044.00');
        expect(stake_amount).toBeInTheDocument();

        const current_price_header = screen.getByText(mockCardLabels().CURRENT_PRICE);
        expect(current_price_header).toBeInTheDocument();
        const current_price_amount = screen.getByText('1,046.80');
        expect(current_price_amount).toBeInTheDocument();

        const barrier_header = screen.getByText(mockCardLabels().BARRIER_LEVEL);
        expect(barrier_header).toBeInTheDocument();
        const barrier_level = screen.getByText('10,904.80');
        expect(barrier_level).toBeInTheDocument();

        const take_profit_header = screen.getByText(mockCardLabels().TAKE_PROFIT);
        expect(take_profit_header).toBeInTheDocument();
        const take_profit_amount = screen.getByText('-');
        expect(take_profit_amount).toBeInTheDocument();

        const total_profit_loss_header = screen.getByText(mockCardLabels().TOTAL_PROFIT_LOSS);
        expect(total_profit_loss_header).toBeInTheDocument();
        const total_profit_loss_amount = screen.getByText('50.00');
        expect(total_profit_loss_amount).toBeInTheDocument();
    });

    // is_sold = true
    it('renders headers when contract is sold', () => {
        render(<TurbosCardBody {...mock_props} is_sold />);

        const profit_loss_header = screen.getByText(mockCardLabels().PROFIT_LOSS);
        expect(profit_loss_header).toBeInTheDocument();
        const profit_loss_amount = screen.getByText('1,044.00');
        expect(profit_loss_amount).toBeInTheDocument();

        const payout_header = screen.getByText(mockCardLabels().PAYOUT);
        expect(payout_header).toBeInTheDocument();
        const payout_amount = screen.getByText('1,046.80');
        expect(payout_amount).toBeInTheDocument();

        const buy_price_header = screen.getByText(mockCardLabels().BUY_PRICE);
        expect(buy_price_header).toBeInTheDocument();
        const buy_price_amount = screen.getByText('1,054.00');
        expect(buy_price_amount).toBeInTheDocument();

        const take_profit_header = screen.queryByText(mockCardLabels().TAKE_PROFIT);
        expect(take_profit_header).not.toBeInTheDocument();
        const take_profit_amount = screen.queryByText('-');
        expect(take_profit_amount).not.toBeInTheDocument();

        expect(screen.getByText('Barrier level')).toBeInTheDocument();
        expect(screen.queryByText('Current price')).not.toBeInTheDocument();
    });
});
