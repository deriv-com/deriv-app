import React from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import { CFD_PLATFORMS } from '../../../constants';
import CompareAccountsTitleIcon from '../CompareAccountsTitleIcon';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('CompareAccountsTitleIcon', () => {
    const defaultProps = {
        isDemo: false,
        marketType: 'financial' as const,
        platform: 'mt5' as const,
        shortCode: 'SVG',
    };

    it('renders default real account title when isDemo is false', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} />, { wrapper });

        expect(screen.getByText('CFDs')).toBeInTheDocument();
    });

    it('renders default demo account title when isDemo is true', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo={true} />, { wrapper });

        expect(screen.getByText('CFDs Demo')).toBeInTheDocument();
    });

    it('renders correct title for Deriv X platform', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} platform={CFD_PLATFORMS.DXTRADE} />, { wrapper });

        expect(screen.getByText('Deriv X')).toBeInTheDocument();
    });

    it('renders correct title for demo Deriv X', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo={true} platform={CFD_PLATFORMS.DXTRADE} />, {
            wrapper,
        });

        expect(screen.getByText('Deriv X Demo')).toBeInTheDocument();
    });

    it('renders correct title for Deriv cTrader platform', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} platform={CFD_PLATFORMS.CTRADER} />, { wrapper });

        expect(screen.getByText('Deriv cTrader')).toBeInTheDocument();
    });

    it('renders correct title for Deriv cTrader platform', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo={true} platform={CFD_PLATFORMS.CTRADER} />, {
            wrapper,
        });

        expect(screen.getByText('Deriv cTrader Demo')).toBeInTheDocument();
    });

    it('renders tooltip for Labuan jurisdiction', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='financial' shortCode='labuan' />, { wrapper });

        expect(screen.getByText('Financial - Labuan')).toBeInTheDocument();
        const tooltip = screen.getByTestId('dt_wallets_compare_accounts_title__tooltip');
        expect(tooltip).toBeInTheDocument();
    });

    it('does not render tooltip for non-Labuan jurisdictions', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} />, { wrapper });

        expect(screen.queryByTestId('dt_wallets_compare_accounts_title__tooltip')).not.toBeInTheDocument();
    });

    it('renders correct title for swap-free accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='all' product='swap_free' shortCode='svg' />, {
            wrapper,
        });
        expect(screen.getByText('Swap-Free - SVG')).toBeInTheDocument();
    });

    it('renders correct title for demo swap-free accounts', () => {
        render(
            <CompareAccountsTitleIcon
                {...defaultProps}
                isDemo={true}
                marketType='all'
                product='swap_free'
                shortCode='svg'
            />,
            { wrapper }
        );

        expect(screen.getByText('Swap-Free Demo')).toBeInTheDocument();
    });

    it('renders correct title for Zero Spread accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='all' product='zero_spread' shortCode='bvi' />, {
            wrapper,
        });
        expect(screen.getByText('Zero Spread - BVI')).toBeInTheDocument();
    });

    it('renders correct title for demo Zero Spread accounts', () => {
        render(
            <CompareAccountsTitleIcon
                {...defaultProps}
                isDemo={true}
                marketType='all'
                product='zero_spread'
                shortCode='bvi'
            />,
            { wrapper }
        );

        expect(screen.getByText('Zero Spread Demo')).toBeInTheDocument();
    });

    it('renders correct title for synthetic SVG accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='synthetic' shortCode='svg' />, { wrapper });

        expect(screen.getByText('Standard - SVG')).toBeInTheDocument();
    });

    it('renders correct title for demo SVG accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo={true} marketType='synthetic' shortCode='svg' />, {
            wrapper,
        });

        expect(screen.getByText('Standard Demo')).toBeInTheDocument();
    });

    it('renders correct title for synthetic BVI accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='synthetic' shortCode='bvi' />, { wrapper });

        expect(screen.getByText('Standard - BVI')).toBeInTheDocument();
    });

    it('renders correct title for synthetic Vanuatu accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='synthetic' shortCode='vanuatu' />, { wrapper });

        expect(screen.getByText('Standard - Vanuatu')).toBeInTheDocument();
    });

    it('renders correct title for financial SVG accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='financial' shortCode='svg' />, { wrapper });

        expect(screen.getByText('Financial - SVG')).toBeInTheDocument();
    });

    it('renders correct title for demo financial SVG accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo={true} marketType='financial' shortCode='svg' />, {
            wrapper,
        });

        expect(screen.getByText('Financial Demo')).toBeInTheDocument();
    });

    it('renders correct title for financial BVI accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='financial' shortCode='bvi' />, { wrapper });

        expect(screen.getByText('Financial - BVI')).toBeInTheDocument();
    });

    it('renders correct title for financial Vanuatu accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} marketType='financial' shortCode='vanuatu' />, { wrapper });

        expect(screen.getByText('Financial - Vanuatu')).toBeInTheDocument();
    });
});
