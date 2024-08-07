import React from 'react';
import { render, screen } from '@testing-library/react';
import EvenOddTradeDescription from '../even-odd-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('EvenOddTradeDescription ', () => {
    it('should render a proper content', () => {
        render(<EvenOddTradeDescription />);

        expect(
            screen.getByText(/you will win the payout if the last digit of the last tick is an even number/i)
        ).toBeInTheDocument();
    });
});
