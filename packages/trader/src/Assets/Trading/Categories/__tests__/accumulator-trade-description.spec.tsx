import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccumulatorTradeDescription } from '../accumulator-trade-description';

describe('<AccumulatorTradeDescription />', () => {
    const trade_descriptions_paragraphs: string[] = [
        'When you open a position, barriers will be created around the asset price. For each new tick, the upper and lower barriers are automatically calculated based on the asset and accumulator value you choose. You will earn a profit if you close your position before the asset price hits either of the barriers.',
        'As long as the price change for each tick is within the barrier, your payout will grow at every tick, based on the accumulator value you’ve selected.',
        'If you select “Take profit” and specify an amount that you’d like to earn, your position will be closed automatically when your profit is more than or equal to this amount. Your profit may be more than the amount you entered depending on the market price (and accumulator value) at closing.',
        'We’ve limited the maximum payout for every contract, and it differs for every asset. Your contract will be closed automatically when the maximum payout is reached.',
        'We’ve also limited the maximum duration for every contract, and it differs according to the accumulator value that you choose. Your contract will be closed automatically when the maximum duration is reached.',
    ];

    const trade_descriptions_headers: string[] = ['Take profit', 'Maximum payout', 'Maximum ticks'];

    it('Ensure content of component is rendered properly', () => {
        render(<AccumulatorTradeDescription />);
        trade_descriptions_paragraphs.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        trade_descriptions_headers.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });
    it('Ensure each text content matches their respective roles', () => {
        render(<AccumulatorTradeDescription />);
        trade_descriptions_paragraphs.forEach(text => {
            expect(screen.getByText(text).tagName).toBe('P');
        });
        trade_descriptions_headers.forEach(text => {
            expect(screen.getByText(text).tagName).toBe('H2');
        });
    });
});
