import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo } from '@deriv/shared';
import userEvent from '@testing-library/user-event';
import MarketSymbolIconRow from '../market-symbol-icon-row';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(({ icon }: { icon: string }) => <div>{icon}</div>),
    IconTradeTypes: jest.fn(({ type }: { type: string }) => <div>{type}</div>),
}));

describe('MarketSymbolIconRow', () => {
    const displayedGrowthRate = '1%';
    const displayedMultiplier = 'x10';
    const mockedSymbolIcon = /IcUnderlying/i;
    const mockedTradeTypeIcon = 'call';
    const symbolTitle = 'Volatility 100 (1s) Index';
    const tradeTypeTitle = 'Rise';
    const mockedAccuPayload = mockContractInfo({
        shortcode: 'ACCU_1HZ100V_10.00_0_0.01_1_0.000433139675_1715181640',
    });
    const mockedMultPayload = mockContractInfo({
        shortcode: 'MULTUP_1HZ100V_10.00_10_1705570990_4859222399_0_0.00',
    });
    const mockedRisePayload = mockContractInfo();

    it('should render symbol icon and contract type icon when payload has a valid shortcode', () => {
        render(<MarketSymbolIconRow payload={mockedRisePayload} />);
        expect(screen.getByText(mockedSymbolIcon)).toBeInTheDocument();
        expect(screen.getByText(mockedTradeTypeIcon)).toBeInTheDocument();
    });
    it('should render an unknown icon when payload has no shortcode and an empty/invalid action_type', () => {
        render(<MarketSymbolIconRow payload={{}} />);
        expect(screen.queryByText(mockedSymbolIcon)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedTradeTypeIcon)).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_unknown_icon')).toBeInTheDocument();
    });
    it('should render a popover with a correct symbol name when symbol icon is hovered', () => {
        render(<MarketSymbolIconRow payload={mockedRisePayload} />);
        const symbolIcon = screen.getByText(mockedSymbolIcon);
        userEvent.hover(symbolIcon);
        expect(screen.getByText(symbolTitle)).toBeInTheDocument();
    });
    it('should render a popover with a correct trade type name when trade type icon is hovered', () => {
        render(<MarketSymbolIconRow payload={mockedRisePayload} />);
        const tradeTypeIcon = screen.getByText(mockedTradeTypeIcon);
        userEvent.hover(tradeTypeIcon);
        expect(screen.getByText(tradeTypeTitle)).toBeInTheDocument();
    });
    it('should render multiplier value when payload.shortcode has multiplier value', () => {
        render(<MarketSymbolIconRow payload={mockedMultPayload} />);
        expect(screen.getByText(displayedMultiplier)).toBeInTheDocument();
    });
    it('should not render multiplier value when payload.shortcode has multiplier value but should_show_multiplier is false', () => {
        render(<MarketSymbolIconRow payload={mockedMultPayload} should_show_multiplier={false} />);
        expect(screen.queryByText(displayedMultiplier)).not.toBeInTheDocument();
    });
    it('should render accumulator % when shortcode in payload.shortcode has growth_rate of 0.01', () => {
        render(<MarketSymbolIconRow payload={mockedAccuPayload} />);
        expect(screen.getByText(displayedGrowthRate)).toBeInTheDocument();
    });
    it('should not render accumulator % when payload.shortcode has growth_rate value but should_show_accumulator is false', () => {
        render(<MarketSymbolIconRow payload={mockedAccuPayload} should_show_accumulator={false} />);
        expect(screen.queryByText(displayedGrowthRate)).not.toBeInTheDocument();
    });
    it('should render a full contract title when has_full_contract_title is true', () => {
        render(<MarketSymbolIconRow payload={mockedRisePayload} has_full_contract_title />);
        expect(screen.getByText(symbolTitle)).toBeInTheDocument();
        expect(screen.getByText(tradeTypeTitle)).toBeInTheDocument();
    });
    it('should render an IcCashierDeposit icon when payload.action_type is "deposit"', () => {
        render(<MarketSymbolIconRow payload={{ action_type: 'deposit' }} />);
        expect(screen.getByText('IcCashierDeposit')).toBeInTheDocument();
    });
    it('should render a custom icon if it is passed when payload.action_type is "deposit"', () => {
        render(<MarketSymbolIconRow payload={{ action_type: 'deposit' }} icon='IcCustomIcon' />);
        expect(screen.getByText('IcCustomIcon')).toBeInTheDocument();
    });
    it('should render an IcCashierWithdrawal icon when payload.action_type is "withdrawal"', () => {
        render(<MarketSymbolIconRow payload={{ action_type: 'withdrawal' }} />);
        expect(screen.getByText('IcCashierWithdrawal')).toBeInTheDocument();
    });
    it('should render an IcAccountTransferColored icon when payload.action_type is "transfer"', () => {
        render(<MarketSymbolIconRow payload={{ action_type: 'transfer' }} />);
        expect(screen.getByText('IcAccountTransferColored')).toBeInTheDocument();
    });
    it('should render an IcCashierDp2p icon when payload.action_type is "hold"', () => {
        render(<MarketSymbolIconRow payload={{ action_type: 'hold' }} />);
        expect(screen.getByText('IcCashierDp2p')).toBeInTheDocument();
    });
    it('should render an IcCashierDp2p icon when payload.action_type is "release"', () => {
        render(<MarketSymbolIconRow payload={{ action_type: 'release' }} />);
        expect(screen.getByText('IcCashierDp2p')).toBeInTheDocument();
    });
    it('should render an IcAdjustment icon when payload.action_type is "adjustment"', () => {
        render(<MarketSymbolIconRow payload={{ action_type: 'adjustment' }} />);
        expect(screen.getByText('IcAdjustment')).toBeInTheDocument();
    });
});
