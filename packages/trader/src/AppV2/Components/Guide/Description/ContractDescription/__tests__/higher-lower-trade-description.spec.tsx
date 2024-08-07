import React from 'react';
import { render, screen } from '@testing-library/react';
import HigherLowerTradeDescription from '../higher-lower-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('HigherLowerTradeDescription', () => {
    it('should render a proper content', () => {
        render(<HigherLowerTradeDescription />);

        expect(
            screen.getByText(/you win the payout if the exit spot is strictly higher than the barrier/i)
        ).toBeInTheDocument();
    });
});
