import React from 'react';
import { render, screen } from '@testing-library/react';
import TradingAccountCard from '../TradingAccountCard';

describe('TradingAccountCard', () => {
    it('should render the component with the children', () => {
        render(<TradingAccountCard>MT5</TradingAccountCard>);
        expect(screen.getByText('MT5')).toBeInTheDocument();
    });

    it('should render the component with the leading component', () => {
        render(<TradingAccountCard leading='Get'>MT5</TradingAccountCard>);
        expect(screen.getByText('Get')).toBeInTheDocument();
    });

    it('should render the component with the trailing component', () => {
        render(<TradingAccountCard trailing='Get'>MT5</TradingAccountCard>);
        expect(screen.getByText(/Get/)).toBeInTheDocument();
    });

    it('should render the component with the leading and trailing component', () => {
        render(
            <TradingAccountCard leading='Transfer' trailing='Open'>
                MT5
            </TradingAccountCard>
        );
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText(/Open/)).toBeInTheDocument();
    });
});
