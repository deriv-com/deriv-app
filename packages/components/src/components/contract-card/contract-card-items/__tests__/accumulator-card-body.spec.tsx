import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo, getCardLabels, isValidToSell } from '@deriv/shared';
import AccumulatorCardBody from '../accumulator-card-body';

type TAccumulatorCardBody = React.ComponentProps<typeof AccumulatorCardBody>;

jest.mock('../toggle-card-dialog', () => jest.fn(() => <div>ToggleCardDialog</div>));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isValidToSell: jest.fn(() => false),
}));

describe('<AccumulatorCardBody />', () => {
    const mock_props: TAccumulatorCardBody = {
        addToast: jest.fn(),
        contract_info: mockContractInfo({
            buy_price: 123,
            sell_price: 234,
            profit: 111,
            contract_id: 12345,
            is_valid_to_sell: 1,
            status: 'sold',
            is_settleable: 1,
            is_expired: 1,
        }),
        contract_update: {
            take_profit: {
                order_amount: 300,
            },
        },
        getCardLabels: () => getCardLabels(),
        getContractById: jest.fn(),
        is_sold: true,
        setCurrentFocus: jest.fn(),
        currency: 'USD',
        removeToast: jest.fn(),
        totalProfit: 111,
    };
    it('should display all contract card items, label, and values', () => {
        render(<AccumulatorCardBody {...mock_props} />);
        expect(screen.getByText(getCardLabels().STAKE)).toBeInTheDocument();
        expect(screen.getByText('123.00')).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText('234.00')).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(screen.getByText('111.00')).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().TAKE_PROFIT)).toBeInTheDocument();
        expect(screen.getByText('300.00')).toBeInTheDocument();
    });

    it('should display Take profit: label and - as value when take_profit is not available', () => {
        if (mock_props?.contract_update?.take_profit?.order_amount)
            mock_props.contract_update.take_profit.order_amount = null;
        render(<AccumulatorCardBody {...mock_props} />);
        expect(screen.getByText(getCardLabels().TAKE_PROFIT)).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should not render arrow indicator if the contract was sold (is_sold === true)', () => {
        render(<AccumulatorCardBody {...mock_props} />);

        expect(screen.queryByTestId('dt_arrow_indicator')).not.toBeInTheDocument();
    });

    it('should render two arrow indicators if the contract was not sold (is_sold === false)', () => {
        render(<AccumulatorCardBody {...mock_props} is_sold={false} />);

        expect(screen.getAllByTestId('dt_arrow_indicator')).toHaveLength(2);
    });

    it('should render ToggleCardDialog component if contract is valid to sell', () => {
        (isValidToSell as jest.Mock).mockReturnValue(true);
        render(<AccumulatorCardBody {...mock_props} />);

        expect(screen.getByText('ToggleCardDialog')).toBeInTheDocument();
    });
});
