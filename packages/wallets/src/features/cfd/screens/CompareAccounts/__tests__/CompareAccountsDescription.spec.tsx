import React from 'react';
import { render, screen } from '@testing-library/react';
import { getJurisdictionDescription } from '../compareAccountsConfig';
import CompareAccountsDescription from '../CompareAccountsDescription';

jest.mock('../compareAccountsConfig', () => ({
    getJurisdictionDescription: jest.fn(),
}));

describe('CompareAccountsDescription', () => {
    const mockJurisdictionData = {
        counterparty_company: 'Deriv (SVG) LLC',
        counterparty_company_description: 'Counterparty company description',
        jurisdiction: 'St. Vincent & Grenadines',
        jurisdiction_description: 'Jurisdiction description',
        leverage: '1:1000',
        leverage_description: 'Leverage description',
        regulator: 'Financial Commission',
        regulator_description: 'Regulator description',
        regulator_license: 'License number',
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
        shortCode: 'SVG',
    };

    it('renders correct compare accounts descriptions for non-demo, non-EU accounts', () => {
        render(<CompareAccountsDescription {...defaultProps} />);

        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Leverage description')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.getByText('Spread description')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC')).toBeInTheDocument();
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Financial Commission')).toBeInTheDocument();
        expect(screen.getByText('License number')).toBeInTheDocument();
    });

    it('renders correct compare accounts descriptions for demo accounts', () => {
        render(<CompareAccountsDescription {...defaultProps} isDemo={true} />);

        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Leverage description')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.queryByText('Deriv (SVG) LLC')).not.toBeInTheDocument();
        expect(screen.queryByText('St. Vincent & Grenadines')).not.toBeInTheDocument();
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

        expect(getJurisdictionDescription).toHaveBeenCalledWith('financial_SVG');
    });
});
