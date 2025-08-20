import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorTradeDescription from '../accumulator-trade-description';

describe('<AccumulatorTradeDescription />', () => {
    it('Ensure content of component is rendered properly', () => {
        render(<AccumulatorTradeDescription />);
        expect(screen.getByText(/is the sum of your initial stake and profit./i)).toBeInTheDocument();
    });
});
