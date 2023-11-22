import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo, getCardLabels } from '@deriv/shared';
import MultiplierCardBody from '../multiplier-card-body';

type TMockedMultiplierCardBodyProps = Partial<React.ComponentProps<typeof MultiplierCardBody>>;

describe('MultiplierCardBody', () => {
    let mock_props: TMockedMultiplierCardBodyProps = {};
    const red_indicative_movement_testid = 'dt_indicative_movement_loss';
    const green_indicative_movement_testid = 'dt_indicative_movement_profit';
    const progress_slider = 'progress_slider';

    beforeEach(() => {
        mock_props = {
            addToast: jest.fn(),
            contract_info: mockContractInfo({
                // 'Total profit/loss' equals to bid_price - buy_price;
                buy_price: 10.44,
                bid_price: 10,
                cancellation: { ask_price: 0.44 },
                is_valid_to_cancel: 0,
                is_valid_to_sell: 0,
                limit_order: {
                    stop_out: {
                        display_name: 'Stop out',
                        order_amount: -10,
                        order_date: 1698680866,
                        value: '1942.71',
                    },
                },
                sell_price: 10,
                status: 'cancelled',
                profit: 0,
                underlying: '1HZ100V',
            }),
            contract_update: {},
            currency: 'USD',
            current_focus: '',
            getCardLabels: () => getCardLabels(),
            getContractById: jest.fn(),
            has_progress_slider: false,
            is_mobile: false,
            is_sold: true,
            onMouseLeave: jest.fn(),
            progress_slider: null,
            removeToast: jest.fn(),
            setCurrentFocus: jest.fn(),
            should_show_cancellation_warning: false,
            status: 'profit',
            toggleCancellationWarning: jest.fn(),
        };
    });

    const testCardContent = () => {
        expect(screen.getByText(getCardLabels().BUY_PRICE)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().CURRENT_STAKE)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().DEAL_CANCEL_FEE)).toBeInTheDocument();
        expect(screen.queryByText(getCardLabels().NOT_AVAILABLE)).not.toBeInTheDocument();
        expect(screen.getByText(getCardLabels().STAKE)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().STOP_LOSS)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().TAKE_PROFIT)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
    };

    it('should render the correct content for a Cancelled contract with Deal cancel.fee and negative Total profit/loss', () => {
        render(<MultiplierCardBody {...mock_props} />);

        testCardContent();
        expect(screen.getByTestId(red_indicative_movement_testid)).toBeInTheDocument();
    });
    it('should render a green price movement indicator when Won with positive Total profit/loss', () => {
        mock_props.contract_info.bid_price = 10.03;
        mock_props.contract_info.buy_price = 10;
        mock_props.contract_info.profit = 0.03;
        mock_props.contract_info.sell_price = 10.03;
        mock_props.contract_info.status = 'sold';
        delete mock_props.contract_info.cancellation;

        render(<MultiplierCardBody {...mock_props} />);

        testCardContent();
        expect(screen.getByTestId(green_indicative_movement_testid)).toBeInTheDocument();
    });
    it('should render correct content for an open contract with negative Total profit/loss in mobile', () => {
        mock_props.is_mobile = true;
        mock_props.contract_info.bid_price = 10.2;
        mock_props.contract_info.buy_price = 10.44;
        mock_props.contract_info.is_sold = 0;
        mock_props.contract_info.is_valid_to_cancel = 1;
        mock_props.contract_info.is_valid_to_sell = 1;
        mock_props.contract_info.profit = 0.2;
        mock_props.contract_info.status = 'open';
        mock_props.status = 'profit';
        mock_props.is_sold = false;
        delete mock_props.contract_info.sell_price;

        render(<MultiplierCardBody {...mock_props} />);

        testCardContent();
        expect(screen.getByTestId(red_indicative_movement_testid)).toBeInTheDocument();
    });
    it('should render progress_slider and N/A in Deal Cancel.fee when contract is open for a crypto asset in mobile', () => {
        mock_props.is_mobile = true;
        mock_props.contract_info.status = 'open';
        mock_props.contract_info.underlying = 'cryBTCUSD';
        mock_props.is_sold = false;
        mock_props.has_progress_slider = true;
        mock_props.progress_slider = progress_slider;
        delete mock_props.contract_info.cancellation;
        delete mock_props.contract_info.sell_price;

        render(<MultiplierCardBody {...mock_props} />);

        expect(screen.getByText(mock_props.getCardLabels().NOT_AVAILABLE)).toBeInTheDocument();
        expect(screen.getByText(progress_slider)).toBeInTheDocument();
    });
});
