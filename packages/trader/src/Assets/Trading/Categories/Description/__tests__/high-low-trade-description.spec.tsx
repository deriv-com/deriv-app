import React from 'react';
import { render, screen } from '@testing-library/react';
import HighLowTradeDescription from '../high-low-trade-description';

describe('<HighLowTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<HighLowTradeDescription />);

        expect(
            screen.getByText((content, element) =>
                /Higher\/Lower lets you predict if the market price will end higher or lower than a set barrier at contract/i.test(
                    content
                )
            )
        ).toBeInTheDocument();
    });
});
