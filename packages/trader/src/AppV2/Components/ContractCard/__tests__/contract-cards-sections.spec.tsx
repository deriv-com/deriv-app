import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractCardsSections from '../contract-cards-sections';

const ContractCard = 'Contract Card';

jest.mock('../contract-card', () => jest.fn(() => <div>{ContractCard}</div>));

const mockProps = {
    positions: [
        {
            contract_info: {
                app_id: 16929,
                buy_price: 10,
                contract_id: 243585717228,
                contract_type: 'TURBOSLONG',
                duration_type: 'minutes',
                longcode:
                    'You will receive a payout at expiry if the spot price never breaches the barrier. The payout is equal to the payout per point multiplied by the distance between the final price and the barrier.',
                payout: 0,
                purchase_time: '27 May 2024 09:41:00',
                sell_price: 0,
                sell_time: '27 May 2024 09:43:36',
                shortcode: 'TURBOSLONG_1HZ100V_10.00_1716802860_1716804660_S-237P_3.971435_1716802860',
                transaction_id: 485824148848,
                underlying_symbol: '1HZ100V',
                profit_loss: '-10.00',
                display_name: '',
                purchase_time_unix: 1716802860,
            },
        },
        {
            contract_info: {
                app_id: 16929,
                buy_price: 10,
                contract_id: 243578583348,
                contract_type: 'MULTUP',
                duration_type: 'days',
                longcode:
                    "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 1000, minus commissions.",
                multiplier: '100',
                payout: 0,
                purchase_time: '27 May 2024 08:11:30',
                sell_price: 0,
                sell_time: '27 May 2024 08:57:17',
                shortcode: 'MULTUP_1HZ100V_10.00_100_1716797490_4870454399_0_0.00_N1',
                transaction_id: 485810770808,
                underlying_symbol: '1HZ100V',
                profit_loss: '-10.00',
                display_name: '',
                purchase_time_unix: 1716797490,
            },
        },
    ],
};

describe('ContractCardsSections', () => {
    it('should not render component if positions prop is empty', () => {
        const { container } = render(<ContractCardsSections />);

        expect(container).toBeEmptyDOMElement();
    });

    it('should render component if positions prop is not empty', () => {
        render(<ContractCardsSections {...mockProps} />);

        const dateSeparator = screen.getByText('27 May 2024');
        expect(dateSeparator).toBeInTheDocument();
        expect(screen.getAllByText(ContractCard)).toHaveLength(2);
    });

    it('should render Loading when isLoading true', () => {
        render(<ContractCardsSections {...mockProps} isLoadingMore />);

        const loader = screen.getByTestId('dt_load_more_spinner');
        expect(loader).toBeInTheDocument();
    });
});
