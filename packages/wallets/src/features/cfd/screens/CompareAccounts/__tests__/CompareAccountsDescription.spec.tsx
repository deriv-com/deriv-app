import React from 'react';
import { render, screen } from '@testing-library/react';
import CompareAccountsDescription from '../CompareAccountsDescription';
import { CFD_PLATFORMS } from '../../../constants';

describe('CompareAccountsDescription', () => {
    const defaultProps = {
        isEuRegion: false,
        product: 'financial' as const,
        productDetails: {
            max_leverage: '1:1000',
            min_spread: '0.6',
        },
    };

    it('renders compare accounts description', () => {
        render(<CompareAccountsDescription {...defaultProps} />);

        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Maximum leverage')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
    });
    
    it('renders cTrader account with 1:10000 leverage', () => {
        render(<CompareAccountsDescription 
            {...defaultProps} 
            platform={CFD_PLATFORMS.CTRADER}
            productDetails={{
                max_leverage: '1:10000',
                min_spread: '0.5',
            }}
        />);

        expect(screen.getByText('Up to 1:10000')).toBeInTheDocument();
        expect(screen.getByText('Maximum leverage')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
    });

    it('renders tooltip for zero spread', () => {
        render(<CompareAccountsDescription {...defaultProps} product='zero_spread' />);
        const tooltip = screen.getByTestId('wallets-compare-accounts-text-container__tooltip');
        expect(tooltip).toBeInTheDocument();
    });

    it('does not render tooltip for non-Labuan jurisdictions', () => {
        render(<CompareAccountsDescription {...defaultProps} />);

        expect(screen.queryByTestId('wallets-compare-accounts-text-container__tooltip')).not.toBeInTheDocument();
    });
});
