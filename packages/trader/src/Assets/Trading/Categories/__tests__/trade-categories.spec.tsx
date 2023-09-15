import React from 'react';
import { render, screen } from '@testing-library/react';
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
jest.mock('../Description/lb-put-trade-desciption', () => jest.fn(() => 'mockedLbPutTradeDescription'));
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

describe('<TradeCategores />', () => {
    it('Ensure AccumulatorTradeDescription is rendered correctly when trade category is "accumulator"', () => {
        render(<TradeCategories category='accumulator' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedaccumulatortradedescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedAsianTradeDescription is rendered correctly when trade category is "asian"', () => {
        render(<TradeCategories category='asian' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedAsianTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedCallPutSpreadTradeDescription is rendered correctly when trade category is "callputspread"', () => {
        render(<TradeCategories category='callputspread' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedCallPutSpreadTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedEndTradeDescription is rendered correctly when trade category is "end"', () => {
        render(<TradeCategories category='end' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedEndTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedEvenOddTradeDescription is rendered correctly when trade category is "even_odd"', () => {
        render(<TradeCategories category='even_odd' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedEvenOddTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedHighLowTradeDescription is rendered correctly when trade category is "high_low"', () => {
        render(<TradeCategories category='high_low' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedHighLowTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedLbCallTradeDescription is rendered correctly when trade category is "lb_call"', () => {
        render(<TradeCategories category='lb_call' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedLbCallTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedLbHighLowTradeDescription is rendered correctly when trade category is "lb_high_low"', () => {
        render(<TradeCategories category='lb_high_low' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedLbHighLowTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedLbPutTradeDescription is rendered correctly when trade category is "lb_put"', () => {
        render(<TradeCategories category='lb_put' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedLbPutTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedMatchDiffTradeDescription is rendered correctly when trade category is "match_diff"', () => {
        render(<TradeCategories category='match_diff' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedMatchDiffTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedMultiplierTradeDescription is rendered correctly when trade category is "multiplier"', () => {
        render(<TradeCategories category='multiplier' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedMultiplierTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedOverUnderTradeDescription is rendered correctly when trade category is "over_under"', () => {
        render(<TradeCategories category='over_under' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedOverUnderTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedResetTradeDescription is rendered correctly when trade category is "reset"', () => {
        render(<TradeCategories category='reset' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedResetTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedRiseFallTradeDescription is rendered correctly when trade category is "rise_fall"', () => {
        render(<TradeCategories category='rise_fall' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedRiseFallTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedRunHighLowTradeDescription is rendered correctly when trade category is "run_high_low"', () => {
        render(<TradeCategories category='run_high_low' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedRunHighLowTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedStayTradeDescription is rendered correctly when trade category is "stay"', () => {
        render(<TradeCategories category='stay' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedStayTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedTickHighLowTradeDescription is rendered correctly when trade category is "tick_high_low"', () => {
        render(<TradeCategories category='tick_high_low' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedTickHighLowTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedTouchTradeDescription is rendered correctly when trade category is "touch"', () => {
        render(<TradeCategories category='touch' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedTouchTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedTurbosTradeDescription is rendered correctly when trade category is "turbosshort"', () => {
        render(<TradeCategories category='turbosshort' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedTurbosTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure mockedVanillaTradeDescription is rendered correctly when trade category is "vanilla"', () => {
        render(<TradeCategories category='vanilla' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedVanillaTradeDescription/i)).toBeInTheDocument();
    });
    it('Ensure description is not found is rendered when trade category doesnt exist', () => {
        render(<TradeCategories category='some_trade_type' onClick={jest.fn()} />);
        expect(screen.getByText(/Description not found./i)).toBeInTheDocument();
    });
    it('Ensure nothing gets rendered if category is empty', () => {
        const { container } = render(<TradeCategories category='' onClick={jest.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });
});
