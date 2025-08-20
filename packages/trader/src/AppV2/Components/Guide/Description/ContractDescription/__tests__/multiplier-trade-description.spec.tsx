import React from 'react';
import { render, screen } from '@testing-library/react';
import MultipliersTradeDescription from '../multipliers-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('MultipliersTradeDescription', () => {
    it('should render a proper content', () => {
        render(<MultipliersTradeDescription onTermClick={jest.fn()} />);

        expect(
            screen.getByText(/Multipliers let you amplify your potential profit or loss by applying /i)
        ).toBeInTheDocument();
    });
});
