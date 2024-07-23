import React from 'react';
import { render, screen } from '@testing-library/react';
import TouchNoTouchTradeDescription from '../touch-no-touch-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('TouchNoTouchTradeDescription', () => {
    it('should render a proper content', () => {
        render(<TouchNoTouchTradeDescription />);

        expect(screen.getByText(/you win the payout if the market never touches the barrier/i)).toBeInTheDocument();
    });
});
