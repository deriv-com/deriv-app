import React from 'react';
import { render, screen } from '@testing-library/react';
import TradeBadge from '../trade-badge';

describe('<TradeBadge />', () => {
    it('should retuen empty DOM element when trade count is less than or equal to 100, poi and poa not verified', () => {
        const { container } = render(<TradeBadge trade_count={99} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render trade badge with trade count 100+', () => {
        render(<TradeBadge trade_count={101} />);
        expect(screen.getByText('100+')).toBeInTheDocument();
    });

    it('should render trade badge with trade count 250+', () => {
        render(<TradeBadge trade_count={300} />);
        expect(screen.getByText('250+')).toBeInTheDocument();
    });

    it('should render `250+ trades` badge if trade count more than 250+ and large is true', () => {
        render(<TradeBadge trade_count={300} large />);
        expect(screen.getByText('250+ trades')).toBeInTheDocument();
    });

    it('should render poi verified badge', () => {
        render(<TradeBadge is_poi_verified trade_count={0} />);
        expect(screen.getByText(/ID/)).toBeInTheDocument();
        expect(screen.getByText(/verified/)).toBeInTheDocument();
    });

    it('should render poa verified badge', () => {
        render(<TradeBadge is_poa_verified trade_count={0} />);
        expect(screen.getByText(/Address/)).toBeInTheDocument();
        expect(screen.getByText(/verified/)).toBeInTheDocument();
    });
});
