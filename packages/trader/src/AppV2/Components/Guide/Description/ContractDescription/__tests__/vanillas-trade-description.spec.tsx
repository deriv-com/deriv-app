import React from 'react';
import { render, screen } from '@testing-library/react';
import VanillasTradeDescription from '../vanillas-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('VanillasTradeDescription', () => {
    it('should render a proper content', () => {
        render(<VanillasTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/Vanillas allow you to predict if the underlying /i)).toBeInTheDocument();
    });
});
