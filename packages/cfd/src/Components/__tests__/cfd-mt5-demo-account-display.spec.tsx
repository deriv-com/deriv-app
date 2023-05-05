import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDMT5DemoAccountDisplay from '../cfd-mt5-demo-account-display';
import { DetailsOfEachMT5Loginid, LandingCompany } from '@deriv/api-types';
import { CFD_PLATFORMS } from '@deriv/shared';

describe('CFDMT5DemoAccountDisplay', () => {
    const mock_standpoint = {
        financial_company: 'financial_company',
        gaming_company: 'gaming_company',
        iom: false,
        malta: false,
        maltainvest: false,
        svg: true,
    };
    type TRecordString = Record<string, DetailsOfEachMT5Loginid>;

    const mock_props = {
        is_eu: false,
        is_eu_country: false,
        has_maltainvest_account: false,
        has_cfd_account_error: false,
        openAccountNeededModal: () => jest.fn(),
        standpoint: mock_standpoint,
        is_loading: false,
        is_logged_in: true,
        isSyntheticCardVisible: jest.fn((account_category: string) => true),
        isFinancialCardVisible: jest.fn().mockReturnValue(false),
        onSelectAccount: jest.fn(),
        openAccountTransfer: jest.fn(),
        platform: CFD_PLATFORMS.MT5,
        current_list: {},
        openPasswordManager: jest.fn().mockReturnValue(true),
        residence: 'country',
        landing_companies: {},
        toggleMT5TradeModal: jest.fn(),
        show_eu_related_content: false,
    };
    it('should render a loading component when is_loading is true', () => {
        render(<CFDMT5DemoAccountDisplay {...mock_props} />);
        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toHaveClass('cfd-demo-accounts-display');
        expect(screen.getByTestId('dt_loading')).toBeInTheDocument();
    });

    it('should render the synthetic account card when isSyntheticCardVisible returns true', () => {
        const mockOnSelectAccount = jest.fn();
        const mockOpenAccountTransfer = jest.fn();
        mock_props.current_list = { 'mt5.demo.synthetic.01': {} };

        render(<CFDMT5DemoAccountDisplay {...mock_props} />);

        expect(screen.getByText('Derived')).toBeInTheDocument();
        expect(screen.getByText('No commission')).toBeInTheDocument();
        expect(screen.getByText('Fund transfer')).toBeInTheDocument();
        expect(screen.getByText('Create account')).toBeInTheDocument();

        const fundTransferButton = screen.getByText('Fund transfer');
        const createAccountButton = screen.getByText('Create account');

        expect(fundTransferButton).toHaveAttribute('href', undefined);
        expect(createAccountButton).toHaveAttribute('href', undefined);

        // Trigger click events on the buttons
        expect(mockOnSelectAccount).not.toHaveBeenCalled();
        expect(mockOpenAccountTransfer).not.toHaveBeenCalled();
        createAccountButton.click();
        expect(mockOnSelectAccount).toHaveBeenCalledTimes(1);
        expect(mockOnSelectAccount).toHaveBeenCalledWith({
            category: 'demo',
            type: 'synthetic',
            platform: undefined,
        });

        fundTransferButton.click();
        expect(mockOpenAccountTransfer).toHaveBeenCalledTimes(1);
        expect(mockOpenAccountTransfer).toHaveBeenCalledWith({}, { category: 'demo', type: 'synthetic' });
    });
});
