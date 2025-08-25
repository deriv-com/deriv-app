import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchesDiffersTradeDescription from '../matches-differs-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('MatchesDiffersTradeDescription', () => {
    it('should render a proper content', () => {
        render(<MatchesDiffersTradeDescription onTermClick={jest.fn()} />);

        expect(
            screen.getByText(/Earn a payout if the last digit of the exit spot differs from your prediction./i)
        ).toBeInTheDocument();
    });
});
