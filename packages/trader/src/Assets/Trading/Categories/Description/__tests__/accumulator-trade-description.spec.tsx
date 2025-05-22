import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorTradeDescription from '../accumulator-trade-description';
import userEvent from '@testing-library/user-event';

describe('<AccumulatorTradeDescription />', () => {
    it('Ensure content of component is rendered properly', () => {
        render(<AccumulatorTradeDescription onClick={jest.fn()} />);
        expect(
            screen.getByText(
                /Your payout will continue to grow as long as the current spot price remains within a specified/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/This feature is unavailable for ongoing accumulator contracts./i)).toBeInTheDocument();
    });
    it('Ensure clicking on definition works', async () => {
        const onClick = jest.fn();
        render(<AccumulatorTradeDescription onClick={onClick} />);
        const glossary_definition = screen.getByText(/growth rate/i);
        await userEvent.click(glossary_definition);
        expect(onClick).toHaveBeenCalled();
    });
});
