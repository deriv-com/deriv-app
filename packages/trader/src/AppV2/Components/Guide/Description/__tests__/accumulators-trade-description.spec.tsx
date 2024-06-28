import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TERM } from 'AppV2/Utils/trade-types-utils';
import AccumulatorsTradeDescription from '../accumulators-trade-description';

describe('AccumulatorsTradeDescription', () => {
    it('should render a proper content', () => {
        render(<AccumulatorsTradeDescription onTermClick={jest.fn()} />);

        expect(
            screen.getByText(
                /Your stake will continue to grow as long as the current spot price remains within a specified/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/This feature is unavailable for ongoing accumulator contracts./i)).toBeInTheDocument();
    });

    it('should call onTermClick if user clicks on term', () => {
        const onTermClick = jest.fn();
        render(<AccumulatorsTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByText(TERM.GROWTH_RATE));

        expect(onTermClick).toHaveBeenCalled();
    });
});
