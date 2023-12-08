import React from 'react';
import { render, screen } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';
import TradeCategories from '../trade-categories';

jest.mock('../Description/accumulator-trade-description', () => jest.fn(() => 'mockedAccumulatorTradeDescription'));
jest.mock('../Description/asian-trade-description', () => jest.fn(() => 'mockedAsianTradeDescription'));
jest.mock('../Description/call-put-spread-trade-description', () =>
    jest.fn(() => 'mockedCallPutSpreadTradeDescription')
);
jest.mock('../Description/end-trade-description', () => jest.fn(() => 'mockedEndTradeDescription'));
jest.mock('../Description/even-odd-trade-description', () => jest.fn(() => 'mockedEvenOddTradeDescription'));
jest.mock('../Description/high-low-trade-description', () => jest.fn(() => 'mockedHighLowTradeDescription'));
jest.mock('../Description/lb-call-trade-description', () => jest.fn(() => 'mockedLbCallTradeDescription'));
jest.mock('../Description/lb-high-low-trade-description', () => jest.fn(() => 'mockedLbHighLowTradeDescription'));
jest.mock('../Description/lb-put-trade-description', () => jest.fn(() => 'mockedLbPutTradeDescription'));
jest.mock('../Description/match-diff-trade-description', () => jest.fn(() => 'mockedMatchDiffTradeDescription'));
jest.mock('../Description/multiplier-trade-description', () => jest.fn(() => 'mockedMultiplierTradeDescription'));
jest.mock('../Description/over-under-trade-description', () => jest.fn(() => 'mockedOverUnderTradeDescription'));
jest.mock('../Description/reset-trade-description', () => jest.fn(() => 'mockedResetTradeDescription'));
jest.mock('../Description/rise-fall-trade-description', () => jest.fn(() => 'mockedRiseFallTradeDescription'));
jest.mock('../Description/run-high-low-trade-description', () => jest.fn(() => 'mockedRunHighLowTradeDescription'));
jest.mock('../Description/stay-trade-description', () => jest.fn(() => 'mockedStayTradeDescription'));
jest.mock('../Description/tick-high-low-trade-description', () => jest.fn(() => 'mockedTickHighLowTradeDescription'));
jest.mock('../Description/touch-trade-description', () => jest.fn(() => 'mockedTouchTradeDescription'));
jest.mock('../Description/turbos-trade-description', () => jest.fn(() => 'mockedTurbosTradeDescription'));
jest.mock('../Description/vanilla-trade-description', () => jest.fn(() => 'mockedVanillaTradeDescription'));

describe('<TradeCategories />', () => {
    it('Ensure AccumulatorTradeDescription is rendered correctly when trade category is "TRADE_TYPES.ACCUMULATOR"', () => {
        render(<TradeCategories category={TRADE_TYPES.ACCUMULATOR} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedaccumulatortradedescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedAsianTradeDescription is rendered correctly when trade category is "TRADE_TYPES.ASIAN"', () => {
        render(<TradeCategories category={TRADE_TYPES.ASIAN} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedAsianTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedCallPutSpreadTradeDescription is rendered correctly when trade category is "TRADE_TYPES.CALL_PUT_SPREAD"', () => {
        render(<TradeCategories category={TRADE_TYPES.CALL_PUT_SPREAD} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedCallPutSpreadTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedEndTradeDescription is rendered correctly when trade category is "TRADE_TYPES.END"', () => {
        render(<TradeCategories category={TRADE_TYPES.END} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedEndTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedEvenOddTradeDescription is rendered correctly when trade category is "TRADE_TYPES.EVEN_ODD"', () => {
        render(<TradeCategories category={TRADE_TYPES.EVEN_ODD} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedEvenOddTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedHighLowTradeDescription is rendered correctly when trade category is "TRADE_TYPES.HIGH_LOW"', () => {
        render(<TradeCategories category={TRADE_TYPES.HIGH_LOW} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedHighLowTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedLbCallTradeDescription is rendered correctly when trade category is "TRADE_TYPES.LB_CALL"', () => {
        render(<TradeCategories category={TRADE_TYPES.LB_CALL} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedLbCallTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedLbHighLowTradeDescription is rendered correctly when trade category is TRADE_TYPES.LB_HIGH_LOW', () => {
        render(<TradeCategories category={TRADE_TYPES.LB_HIGH_LOW} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedLbHighLowTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedLbPutTradeDescription is rendered correctly when trade category is "TRADE_TYPES.LB_PUT"', () => {
        render(<TradeCategories category={TRADE_TYPES.LB_PUT} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedLbPutTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedMatchDiffTradeDescription is rendered correctly when trade category is "TRADE_TYPES.MATCH_DIFF"', () => {
        render(<TradeCategories category={TRADE_TYPES.MATCH_DIFF} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedMatchDiffTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedMultiplierTradeDescription is rendered correctly when trade category is "TRADE_TYPES.MULTIPLIER"', () => {
        render(<TradeCategories category={TRADE_TYPES.MULTIPLIER} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedMultiplierTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedOverUnderTradeDescription is rendered correctly when trade category is "TRADE_TYPES.OVER_UNDER"', () => {
        render(<TradeCategories category={TRADE_TYPES.OVER_UNDER} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedOverUnderTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedResetTradeDescription is rendered correctly when trade category is "TRADE_TYPES.RESET"', () => {
        render(<TradeCategories category={TRADE_TYPES.RESET} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedResetTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedRiseFallTradeDescription is rendered correctly when trade category is "TRADE_TYPES.RISE_FALL"', () => {
        render(<TradeCategories category={TRADE_TYPES.RISE_FALL} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedRiseFallTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedRunHighLowTradeDescription is rendered correctly when trade category is "TRADE_TYPES.RUN_HIGH_LOW"', () => {
        render(<TradeCategories category={TRADE_TYPES.RUN_HIGH_LOW} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedRunHighLowTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedStayTradeDescription is rendered correctly when trade category is "TRADE_TYPES.STAY"', () => {
        render(<TradeCategories category={TRADE_TYPES.STAY} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedStayTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedTickHighLowTradeDescription is rendered correctly when trade category is "TRADE_TYPES.TICK_HIGH_LOW"', () => {
        render(<TradeCategories category={TRADE_TYPES.TICK_HIGH_LOW} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedTickHighLowTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedTouchTradeDescription is rendered correctly when trade category is "TRADE_TYPES.TOUCH"', () => {
        render(<TradeCategories category={TRADE_TYPES.TOUCH} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedTouchTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedTurbosTradeDescription is rendered correctly when trade category is "TRADE_TYPES.TURBOS.SHORT"', () => {
        render(<TradeCategories category={TRADE_TYPES.TURBOS.SHORT} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedTurbosTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedVanillaTradeDescription is rendered correctly when trade category is "TRADE_TYPES.VANILLA.CALL"', () => {
        render(<TradeCategories category={TRADE_TYPES.VANILLA.CALL} onClick={jest.fn()} />);
        expect(screen.getByText(/mockedVanillaTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure description is not found is rendered when trade category does not exist', () => {
        render(<TradeCategories category='some_trade_type' onClick={jest.fn()} />);
        expect(screen.getByText(/Description not found./i)).toBeInTheDocument();
    });
    it('Ensure nothing gets rendered if category is empty', () => {
        const { container } = render(<TradeCategories category='' onClick={jest.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });
});
