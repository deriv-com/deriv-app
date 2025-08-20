import React from 'react';
import { render, screen } from '@testing-library/react';
import MultiplierTradeDescription from '../multiplier-trade-description';

describe('<MultiplierTradeDescription />', () => {
    it('a proper text of description should be rendered', () => {
        render(<MultiplierTradeDescription />);

        expect(
            screen.getByText((content, element) =>
                /Multipliers let you amplify your potential profit or loss by applying a multiplier/i.test(content)
            )
        ).toBeInTheDocument();
    });
});
