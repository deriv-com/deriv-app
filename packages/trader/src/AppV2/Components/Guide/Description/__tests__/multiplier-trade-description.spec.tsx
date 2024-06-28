import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TERM } from 'AppV2/Utils/trade-types-utils';
import MultipliersTradeDescription from '../multipliers-trade-description';

describe('MultipliersTradeDescription', () => {
    it('should render a proper content', () => {
        render(<MultipliersTradeDescription onTermClick={jest.fn()} />);

        expect(
            screen.getByText(/your total profit\/loss will be the percentage increase in the underlying asset price/i)
        ).toBeInTheDocument();
    });
    it('should call onTermClick if user clicks on term', () => {
        const onTermClick = jest.fn();
        render(<MultipliersTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByText(TERM.DEAL_CANCELLATION));

        expect(onTermClick).toHaveBeenCalled();
    });
});
