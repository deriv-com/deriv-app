import React from 'react';
import { render, screen } from '@testing-library/react';
import MarketSymbolIconRow from '../market-symbol-icon-row';
import { CONTRACT_TYPES, mockContractInfo } from '@deriv/shared';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(({ icon }: { icon: string }) => <div>{icon}</div>),
    IconTradeTypes: jest.fn(({ type }: { type: string }) => <div>{type}</div>),
}));

describe('MarketSymbolIconRow', () => {
    const mockedRisePayload = mockContractInfo();
    // const mockedMultPayload = mockContractInfo({
    //     buy_price: 10.44,
    //     bid_price: 10,
    //     cancellation: { ask_price: 0.44 },
    //     contract_type: CONTRACT_TYPES.MULTIPLIER.UP,
    //     is_valid_to_cancel: 1,
    //     is_valid_to_sell: 1,
    //     limit_order: {
    //         stop_out: {
    //             display_name: 'Stop out',
    //             order_amount: -10,
    //             order_date: 1698680866,
    //             value: '1942.71',
    //         },
    //     },
    //     shortcode: 'MULTUP_1HZ100V_10.00_10_1705570990_4859222399_0_0.00',
    //     underlying: 'R_100',
    // });
    // const mockedAccuPayload = mockContractInfo({
    //     contract_type: CONTRACT_TYPES.ACCUMULATOR,
    //     current_spot: 1232.555,
    //     current_spot_high_barrier: '1232.777',
    //     current_spot_low_barrier: '1232.333',
    //     high_barrier: '1232.666',
    //     low_barrier: '1232.222',
    //     shortcode: 'ACCU_R_100_10.00_0_0.01_1_0.000433139675_1715181640',
    //     underlying: 'R_100',
    // });
    const mockedAccuBuyTransactionPayload = {
        action: 'Sell',
        date: '08 May 2024 15:20:50',
        display_name: 'Volatility 100 Index',
        refid: 481532448168,
        payout: '0.00',
        amount: '10.94',
        balance: '8,775.84',
        desc: 'After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.04331% from the previous spot price.',
        id: 241410275188,
        app_id: 51072,
        shortcode: 'ACCU_R_100_10.00_0_0.01_1_0.000433139675_1715181640',
        action_type: 'sell',
        purchase_time: 1715181640,
        transaction_time: 1715181650,
    } as const;

    it('should render icons for underlying and contract type in Open positions or Trade table', () => {
        render(<MarketSymbolIconRow payload={mockedRisePayload} />);
        expect(screen.getByText(/IcUnderlying/i)).toBeInTheDocument();
        expect(screen.getByText('call')).toBeInTheDocument();
    });

    it('should render icons for underlying and contract type for Buy transaction in Statement', () => {
        render(<MarketSymbolIconRow payload={mockedAccuBuyTransactionPayload} />);
        expect(screen.getByText(/IcUnderlying/i)).toBeInTheDocument();
        expect(screen.getByText('accu')).toBeInTheDocument();
        expect(screen.getByText('1%')).toBeInTheDocument();
    });

    // it('should render popover with a correct symbol name when symbol icon is hovered', () => {
    //     const { getByText } = render(<MarketSymbolIconRow payload={mockedRisePayload} />);
    //     expect(getByText('Volatility 100 Index')).toBeInTheDocument();
    // });

    // it('should render popover with a correct trade type name when trade type icon is hovered', () => {
    //     const { getByText } = render(<MarketSymbolIconRow payload={mockedAccuPayload} />);
    //     expect(getByText('Accumulators')).toBeInTheDocument();
    // });

    // it('should render multiplier value when payload has multiplier value', () => {
    //     const { getByText } = render(<MarketSymbolIconRow payload={mockedMultPayload} />);
    //     expect(getByText('Multiplier')).toBeInTheDocument();
    // });

    // it('should not render multiplier value when payload has multiplier value but should_show_multiplier is false', () => {
    //     const { getByText } = render(<MarketSymbolIconRow payload={mockedMultPayload} should_show_multiplier={false} />);
    //     expect(queryByText('Multiplier')).toBeNull();
    // });

    // it('should render accumulator % when shortcode in payload has growth_rate of 0.01', () => {
    //     const { getByText } = render(<MarketSymbolIconRow payload={mockedAccuPayload} should_show_accumulator={true} />);
    //     expect(getByText('Accumulator')).toBeInTheDocument();
    // });

    // it('should not render accumulator % when payload has accumulator % but should_show_accumulator is false', () => {
    //     const { queryByText } = render(<MarketSymbolIconRow payload={mockedAccuPayload} should_show_accumulator={should_show_accumulator} />);
    //     expect(queryByText('Accumulator')).toBeNull();
    // });

    // it('should render a custom icon if it's passed via props', () => {
    //     const { queryByText } = render(<MarketSymbolIconRow payload={mockedAccuPayload} icon='IcCustomIcon />);
    //     expect(queryByText('IcCustomIcon')).toBeInTheDocument();
    // });

    // it('should render a full contract title when has_full_contract_title is true', () => {
    //     const { queryByText } = render(<MarketSymbolIconRow payload={mockedAccuPayload} has_full_contract_title />);
    //     expect(queryByText('IcCustomIcon')).toBeInTheDocument();
    // });
});
