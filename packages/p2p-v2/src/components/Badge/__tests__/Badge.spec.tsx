import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
    it('should render the label and statuses correctly', () => {
        render(<Badge label='Trades' status='100+' variant='general' />);
        expect(screen.getByText('Trades')).toBeInTheDocument();
        expect(screen.getByText('100+')).toBeInTheDocument();
    });
    it('should render the correct trade count', () => {
        render(<Badge tradeCount={120} />);
        expect(screen.getByText('100+')).toBeInTheDocument();
        render(<Badge tradeCount={340} />);
        expect(screen.getByText('250+')).toBeInTheDocument();
    });
});
