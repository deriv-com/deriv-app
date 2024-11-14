import React from 'react';
import { localize } from '@deriv-com/translations';
import { render, screen } from '@testing-library/react';
import { getJurisdictionDescription } from '../compareAccountsConfig';
import CompareAccountsDescription from '../CompareAccountsDescription';

jest.mock('../compareAccountsConfig', () => ({
    getJurisdictionDescription: jest.fn(),
}));

describe('CompareAccountsDescription', () => {
    const mockJurisdictionData = {
        leverage: 'Up to 1:1000',
        leverage_description: 'Leverage description',
        spread: '0.6 pips',
        spread_description: 'Spread description',
    };

    beforeEach(() => {
        (getJurisdictionDescription as jest.Mock).mockReturnValue(mockJurisdictionData);
    });

    const defaultProps = {
        isDemo: false,
        isEuRegion: false,
        marketType: 'financial' as const,
        platform: 'mt5' as const,
        shortCode: 'SVG',
    };

    it('renders correct compare accounts descriptions for non-demo, non-EU accounts', () => {
        render(<CompareAccountsDescription {...defaultProps} />);

        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Leverage description')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.getByText('Spread description')).toBeInTheDocument();
    });

    it('renders correct compare accounts descriptions for demo accounts', () => {
        render(<CompareAccountsDescription {...defaultProps} isDemo={true} />);

        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Leverage description')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
    });

    it('renders correct compare accounts descriptions for EU region accounts', () => {
        render(<CompareAccountsDescription {...defaultProps} isEuRegion={true} />);

        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.queryByText('0.6 pips')).not.toBeInTheDocument();
        expect(screen.queryByText('Spread description')).not.toBeInTheDocument();
    });

    it('calls getJurisdictionDescription with correct marketTypeShortCode', () => {
        render(<CompareAccountsDescription {...defaultProps} />);

        expect(getJurisdictionDescription).toHaveBeenCalledWith(localize, 'financial_SVG');
    });

    it('renders tooltip for zero spread', () => {
        render(
            <CompareAccountsDescription
                {...defaultProps}
                marketType='all'
                platform='mt5'
                product='zero_spread'
                shortCode='bvi'
            />
        );
        const tooltip = screen.getByTestId('wallets-compare-accounts-text-container__tooltip');
        expect(tooltip).toBeInTheDocument();
    });

    it('does not render tooltip for non-Labuan jurisdictions', () => {
        render(<CompareAccountsDescription {...defaultProps} />);

        expect(screen.queryByTestId('wallets-compare-accounts-text-container__tooltip')).not.toBeInTheDocument();
    });
});
