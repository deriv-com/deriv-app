import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo, CONTRACT_TYPES } from '@deriv/shared';
import LookBacksCardBody from '../lookbacks-card-body';

type TLookBacksCardBody = React.ComponentProps<typeof LookBacksCardBody>;

describe('<LookBacksCardBody />', () => {
    const mock_props: TLookBacksCardBody = {
        contract_info: mockContractInfo({
            buy_price: 6.55,
            contract_type: CONTRACT_TYPES.LB_HIGH_LOW,
            sell_price: 5.06,
            profit: -1.49,
            multiplier: 5,
        }),
        is_sold: false,
        currency: 'USD',
        indicative: 5.06,
        progress_slider_mobile_el: <div>Progress slider</div>,
    };

    it('should display all appropriate contract card fields, labels and values for ongoing contract', () => {
        render(<LookBacksCardBody {...mock_props} />);

        expect(screen.getByText('Potential profit/loss:')).toBeInTheDocument();
        expect(screen.getByText('1.49')).toBeInTheDocument();
        expect(screen.getByText('Indicative price:')).toBeInTheDocument();
        expect(screen.getByText('5.06')).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_arrow_indicator')).toHaveLength(2);
        expect(screen.getByText('Buy price:')).toBeInTheDocument();
        expect(screen.getByText('6.55')).toBeInTheDocument();
        expect(screen.getByText('Multiplier:')).toBeInTheDocument();
        expect(screen.getByText('x5')).toBeInTheDocument();
    });

    it('should display all appropriate contract card fields, labels and values for sold contract', () => {
        render(<LookBacksCardBody {...mock_props} is_sold />);

        expect(screen.getByText('Profit/Loss:')).toBeInTheDocument();
        expect(screen.getByText('1.49')).toBeInTheDocument();
        expect(screen.getByText('Sell price:')).toBeInTheDocument();
        expect(screen.getByText('5.06')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_arrow_indicator')).not.toBeInTheDocument();
        expect(screen.getByText('Buy price:')).toBeInTheDocument();
        expect(screen.getByText('6.55')).toBeInTheDocument();
        expect(screen.getByText('Multiplier:')).toBeInTheDocument();
        expect(screen.getByText('x5')).toBeInTheDocument();
    });

    it('should display correct Payout limit for High-Low contract', () => {
        render(<LookBacksCardBody {...mock_props} />);

        expect(screen.getByText('Payout limit: 5 x (High - Low)')).toBeInTheDocument();
    });

    it('should display correct Payout limit for High-Close contract', () => {
        mock_props.contract_info.contract_type = CONTRACT_TYPES.LB_PUT;
        render(<LookBacksCardBody {...mock_props} />);

        expect(screen.getByText('Payout limit: 5 x (High - Close)')).toBeInTheDocument();
    });

    it('should display correct Payout limit for Close-Low contract', () => {
        mock_props.contract_info.contract_type = CONTRACT_TYPES.LB_CALL;
        render(<LookBacksCardBody {...mock_props} />);

        expect(screen.getByText('Payout limit: 5 x (Close - Low)')).toBeInTheDocument();
    });
});
