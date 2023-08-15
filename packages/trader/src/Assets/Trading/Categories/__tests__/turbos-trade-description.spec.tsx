import React from 'react';
import { render, screen } from '@testing-library/react';
import { TurbosTradeDescription } from '../turbos-trade-description';

describe('<TurbosTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<TurbosTradeDescription />);
        expect(
            screen.getByText(
                /This product allows you to express a strong bullish or bearish view on an underlying asset/i
            )
        ).toBeInTheDocument();
    });
});
