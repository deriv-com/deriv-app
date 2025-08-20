import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsTradeDescription from '../accumulators-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('AccumulatorsTradeDescription', () => {
    it('should render a proper content', () => {
        render(<AccumulatorsTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/Accumulators allow you to predict how much an/i)).toBeInTheDocument();
    });
});
