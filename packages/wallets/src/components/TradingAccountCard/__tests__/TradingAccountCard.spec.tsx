import React from 'react';
import { render, screen } from '@testing-library/react';
import TradingAccountCard from '../TradingAccountCard';

describe('TradingAccountCard', () => {
    it('should render the component with the children', () => {
        render(
            <TradingAccountCard>
                <TradingAccountCard.Content>MT5</TradingAccountCard.Content>
            </TradingAccountCard>
        );
        expect(screen.getByText('MT5')).toBeInTheDocument();
    });

    it('should render the component with the leading component', () => {
        render(
            <TradingAccountCard>
                <TradingAccountCard.Icon>
                    <img aria-label='Icon' src='icon' />
                </TradingAccountCard.Icon>
                <TradingAccountCard.Content>MT5</TradingAccountCard.Content>
            </TradingAccountCard>
        );
        expect(screen.getByRole('img', { name: 'Icon' })).toBeInTheDocument();
    });

    it('should render the component with the trailing component', () => {
        render(
            <TradingAccountCard>
                <TradingAccountCard.Content>MT5</TradingAccountCard.Content>
                <TradingAccountCard.Button>
                    <button>Get</button>
                </TradingAccountCard.Button>
            </TradingAccountCard>
        );
        expect(screen.getByRole('button', { name: 'Get' })).toBeInTheDocument();
    });

    it('should render the component with the leading and trailing component', () => {
        render(
            <TradingAccountCard>
                <TradingAccountCard.Icon>
                    <img aria-label='Icon' src='icon' />
                </TradingAccountCard.Icon>
                <TradingAccountCard.Content>MT5</TradingAccountCard.Content>
                <TradingAccountCard.Button>
                    <button>Open</button>
                </TradingAccountCard.Button>
            </TradingAccountCard>
        );
        expect(screen.getByRole('img', { name: 'Icon' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });
});
