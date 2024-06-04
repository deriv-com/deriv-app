import React from 'react';
import { render, screen } from '@testing-library/react';
import RunStrategy from '../run-strategy';

jest.mock('Components/trade-animation', () => jest.fn(() => <div>TradeAnimation</div>));

describe('RunStrategy', () => {
    beforeEach(() => {
        render(<RunStrategy />);
    });

    it('should render the RunStrategy component', () => {
        const run_strategy = screen.getByTestId('dt_run_strategy');

        expect(run_strategy).toBeInTheDocument();
    });

    it('should render the TradeAnimation component inside of RunStrategy', () => {
        const trade_animation = screen.getByText('TradeAnimation');

        expect(trade_animation).toBeInTheDocument();
    });
});
