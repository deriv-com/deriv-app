import React from 'react';
import { render, screen } from '@testing-library/react';
import TurbosTradeDescription from '../turbos-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('TurbosTradeDescription', () => {
    it('should render a proper content', () => {
        render(<TurbosTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/You may sell your contract up to 15 seconds before/i)).toBeInTheDocument();
    });
});
