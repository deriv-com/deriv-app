import React from 'react';
import { render, screen } from '@testing-library/react';
import TradeCategories from '../trade-categories';

jest.mock('../accumulator-trade-description', () => jest.fn(() => 'mockedAccumulatorTradeDescription'));

describe('<TradeCategores />', () => {
    it('Ensure mockedAccumulatorTradeDescription is rendered correctly when trade category is "accumulator"', () => {
        render(<TradeCategories category='accumulator' onClick={jest.fn()} />);
        expect(screen.getByText(/mockedaccumulatortradedescription/i)).toBeInTheDocument();
    });
    it('Ensure trade category "rise_fall" description is rendered properly', () => {
        render(<TradeCategories category='rise_fall' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Rise", you win the payout if the exit spot is strictly higher than the entry spot./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "rise_fall_equal" description is rendered properly', () => {
        render(<TradeCategories category='rise_fall_equal' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Allow equals", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall"./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "high_low" description is rendered properly', () => {
        render(<TradeCategories category='high_low' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Higher", you win the payout if the exit spot is strictly higher than the barrier./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "end" description is rendered properly', () => {
        render(<TradeCategories category='end' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Ends Between", you win the payout if the exit spot is strictly higher than the Low barrier AND strictly lower than the High barrier./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "stay" description is rendered properly', () => {
        render(<TradeCategories category='stay' onClick={jest.fn()} />);
        expect(
            screen.getByText(/If you select "Stays Between", you win the payout if the market stays between/i)
        ).toBeInTheDocument();
    });
    it('Ensure trade category "match_diff" description is rendered properly', () => {
        render(<TradeCategories category='match_diff' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Matches", you will win the payout if the last digit of the last tick is the same as your prediction./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "even_odd" description is rendered properly', () => {
        render(<TradeCategories category='even_odd' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Even", you will win the payout if the last digit of the last tick is an even number/i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "over_under" description is rendered properly', () => {
        render(<TradeCategories category='over_under' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Over", you will win the payout if the last digit of the last tick is greater than your prediction./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "touch" description is rendered properly', () => {
        render(<TradeCategories category='touch' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Touch", you win the payout if the market touches the barrier at any time during the contract period./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "asian" description is rendered properly', () => {
        render(<TradeCategories category='asian' onClick={jest.fn()} />);
        expect(
            screen.getByText(/Asian options settle by comparing the last tick with the average spot over the period./i)
        ).toBeInTheDocument();
    });
    it('Ensure trade category "run_high_low" description is rendered properly', () => {
        render(<TradeCategories category='run_high_low' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Only Ups", you win the payout if consecutive ticks rise successively after the entry spot. No payout if any tick falls or is equal to any of the previous ticks./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "reset" description is rendered properly', () => {
        render(<TradeCategories category='reset' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "Reset-Up”, you win the payout if the exit spot is strictly higher than either the entry spot or the spot at reset time./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "callputspread" description is rendered properly', () => {
        render(<TradeCategories category='callputspread' onClick={jest.fn()} />);
        expect(
            screen.getByText(/Win maximum payout if the exit spot is higher than or equal to the upper barrier./i)
        ).toBeInTheDocument();
    });
    it('Ensure trade category "tick_high_low" description is rendered properly', () => {
        render(<TradeCategories category='tick_high_low' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /If you select "High Tick", you win the payout if the selected tick is the highest among the next five ticks./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "lb_high_low" description is rendered properly', () => {
        render(<TradeCategories category='lb_high_low' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /By purchasing the "High-to-Low" contract, you'll win the multiplier times the difference between the high and low over the duration of the contract./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "lb_put" description is rendered properly', () => {
        render(<TradeCategories category='lb_put' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /By purchasing the "High-to-Close" contract, you'll win the multiplier times the difference between the high and close over the duration of the contract./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "lb_call" description is rendered properly', () => {
        render(<TradeCategories category='lb_call' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /By purchasing the "Close-to-Low" contract, you'll win the multiplier times the difference between the close and low over the duration of the contract./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "multiplier" description is rendered properly', () => {
        render(<TradeCategories category='multiplier' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /Predict the market direction and select either “Up” or “Down” to open a position. We will charge a commission when you open a position./i
            )
        ).toBeInTheDocument();
    });
    it('Ensure trade category "vanilla" description is rendered properly', () => {
        render(<TradeCategories category='vanilla' onClick={jest.fn()} />);
        expect(
            screen.getByText(
                'Vanilla options allow you to predict an upward (bullish) or downward (bearish) direction of the underlying asset by purchasing a "Call" or a "Put".'
            )
        ).toBeInTheDocument();
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
