import React from 'react';
import { render, screen } from '@testing-library/react';
import { THooks } from '../../../../../../types';
import MT5LicenseMessage from '../MT5LicenceMessage';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

const mockRegulatedAccount = {
    licence_number: 'mock_licence_number',
    market_type: 'financial',
    name: 'mock_company_name',
    product: 'financial',
    regulatory_authority: 'mock_regulatory_authority',
    shortcode: 'bvi',
} as unknown as THooks.SortedMT5Accounts;

const mockNonRegulatedAccount = {
    market_type: 'all',
    name: 'mock_company_name',
    product: 'swap_free',
    shortcode: 'svg',
} as unknown as THooks.SortedMT5Accounts;

describe('<MT5LicenceMessage />', () => {
    it('should show message for regulated account', () => {
        render(<MT5LicenseMessage account={mockRegulatedAccount} />);

        expect(
            screen.getByText(
                'You are adding your Deriv MT5 Financial account under mock_company_name, regulated by the mock_regulatory_authority (licence no. mock_licence_number).'
            )
        );
    });

    it('should show message for non-regulated account', () => {
        render(<MT5LicenseMessage account={mockNonRegulatedAccount} />);

        expect(
            screen.getByText(
                'You are adding your Deriv MT5 Swap-Free account under mock_company_name (company no. 273 LLC 2020).'
            )
        );
    });
});
