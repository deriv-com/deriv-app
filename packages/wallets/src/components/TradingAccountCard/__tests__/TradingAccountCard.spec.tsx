import React from 'react';
import { render, screen } from '@testing-library/react';
import TradingAccountCard from '../TradingAccountCard';

describe('TradingAccountCard', () => {
    it('should render the component with the children', () => {
        render(<TradingAccountCard>MT5</TradingAccountCard>);
        expect(screen.getByText('MT5')).toBeInTheDocument();
    });

    it('should render the component with the leading component', () => {
        render(<TradingAccountCard leading={<button>Get</button>}>MT5</TradingAccountCard>);
        expect(screen.getByRole('button', { name: 'Get' })).toBeInTheDocument();
    });

    it('should render the component with the trailing component', () => {
        render(<TradingAccountCard trailing={<button>Get</button>}>MT5</TradingAccountCard>);
        expect(screen.getByRole('button', { name: 'Get' })).toBeInTheDocument();
    });

    it('should render the component with the leading and trailing component', () => {
        render(
            <TradingAccountCard leading={<button>Transfer</button>} trailing={<button>Open</button>}>
                MT5
            </TradingAccountCard>
        );
        expect(screen.getByRole('button', { name: 'Transfer' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });
});
