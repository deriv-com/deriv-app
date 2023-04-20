import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccumulatorTradeDescription } from '../accumulator-trade-description';

describe('<AccumulatorTradeDescription />', () => {
    it('Ensure content of component is rendered properly', () => {
        render(<AccumulatorTradeDescription />);
        expect(
            screen.getByText(
                /As long as the price change for each tick is within the barrier, your payout will grow at every tick, based on the accumulator value you’ve selected./i
            )
        ).toBeInTheDocument();
    });
});
