import React from 'react';
import { render, screen } from '@testing-library/react';
import OverUnderTradeDescription from '../over-under-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('OverUnderTradeDescription', () => {
    it('should render a proper content', () => {
        render(<OverUnderTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/Over\/Under lets you predict if the last digit of the/i)).toBeInTheDocument();
    });
});
