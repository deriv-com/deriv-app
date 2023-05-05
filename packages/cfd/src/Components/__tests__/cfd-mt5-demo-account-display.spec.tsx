import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDMT5DemoAccountDisplay from '../cfd-mt5-demo-account-display';
import { CFD_PLATFORMS } from '@deriv/shared';

//mock cfd-account-card
jest.mock('../cfd-account-card', () => ({
    CFDAccountCard: () => <div>CFDAccountCard</div>,
}));

describe('CFDMT5DemoAccountDisplay', () => {
    const mock_standpoint = {
        financial_company: 'financial_company',
        gaming_company: 'gaming_company',
        iom: false,
        malta: false,
        maltainvest: false,
        svg: true,
    };

    const mock_props: React.ComponentProps<typeof CFDMT5DemoAccountDisplay> = {
        is_eu: false,
        is_eu_country: false,
        has_maltainvest_account: false,
        has_cfd_account_error: false,
        openAccountNeededModal: () => jest.fn(),
        standpoint: mock_standpoint,
        is_loading: false,
        is_logged_in: true,
        isSyntheticCardVisible: jest.fn(() => true),
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
        render(<CFDMT5DemoAccountDisplay {...mock_props} is_loading={true} />);
        expect(screen.getByTestId('dt_barspinner')).toBeInTheDocument();
    });

    it('should render a loading component when is_loading is false', () => {
        render(<CFDMT5DemoAccountDisplay {...mock_props} is_loading={false} />);
        // screen.debug();
        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toHaveClass('cfd-demo-accounts-display');
        expect(screen.getByTestId('dt_cfd_demo_accounts_display')).toBeInTheDocument();
    });

    it('should render the synthetic account card when isSyntheticCardVisible returns true', () => {
        mock_props.current_list = { 'mt5.demo.synthetic.01': {} };

        render(<CFDMT5DemoAccountDisplay {...mock_props} />);

        expect(screen.getByText('CFDAccountCard')).toBeInTheDocument();
    });

    // it('should render the financial account card when isFinancialCardVisible returns true', () => {
    //     mock_props.current_list = { 'mt5.demo.financial.01': {} };

    //     render(<CFDMT5DemoAccountDisplay {...mock_props} />);

    //     expect(screen.getByText('CFDAccountCard')).toBeInTheDocument();
    // });
});
