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
        isEuRegion: false,
        platform: 'mt5' as const,
        product: 'financial' as const,
    };

    it('renders CFDs title when isDemo is false and isEuRegion is true', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isEuRegion />, { wrapper });

        expect(screen.getByText('CFDs')).toBeInTheDocument();
    });

    it('renders CFDs Demo title when isDemo is true and isEuRegion is true', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo isEuRegion />, { wrapper });

        expect(screen.getByText('CFDs Demo')).toBeInTheDocument();
    });

    it('renders correct title for Deriv X platform', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} platform={CFD_PLATFORMS.DXTRADE} />, { wrapper });

        expect(screen.getByText('Deriv X')).toBeInTheDocument();
    });

    it('renders correct title for demo Deriv X', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo platform={CFD_PLATFORMS.DXTRADE} />, {
            wrapper,
        });

        expect(screen.getByText('Deriv X Demo')).toBeInTheDocument();
    });

    it('renders correct title for Deriv cTrader platform', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} platform={CFD_PLATFORMS.CTRADER} />, { wrapper });

        expect(screen.getByText('Deriv cTrader')).toBeInTheDocument();
    });

    it('renders correct title for demo Deriv cTrader', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo platform={CFD_PLATFORMS.CTRADER} />, {
            wrapper,
        });

        expect(screen.getByText('Deriv cTrader Demo')).toBeInTheDocument();
    });

    it('renders tooltip for stp accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} product='stp' />, { wrapper });

        expect(screen.getByText('Financial - STP')).toBeInTheDocument();
        const tooltip = screen.getByTestId('dt_wallets_compare_accounts_title__tooltip');
        expect(tooltip).toBeInTheDocument();
    });

    it('does not render tooltip for non-stp accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} />, { wrapper });

        expect(screen.queryByTestId('dt_wallets_compare_accounts_title__tooltip')).not.toBeInTheDocument();
    });

    it('renders correct title for swap-free accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} product='swap_free' />, {
            wrapper,
        });
        expect(screen.getByText('Swap-Free')).toBeInTheDocument();
    });

    it('renders correct title for demo swap-free accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo product='swap_free' />, {
            wrapper,
        });

        expect(screen.getByText('Swap-Free Demo')).toBeInTheDocument();
    });

    it('renders correct title for Zero Spread accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} product='zero_spread' />, {
            wrapper,
        });
        expect(screen.getByText('Zero Spread')).toBeInTheDocument();
    });

    it('renders correct title for demo Zero Spread accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo product='zero_spread' />, {
            wrapper,
        });

        expect(screen.getByText('Zero Spread Demo')).toBeInTheDocument();
    });

    it('renders correct title standard accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} product='standard' />, { wrapper });

        expect(screen.getByText('Standard')).toBeInTheDocument();
    });

    it('renders correct title for demo standard accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo product='standard' />, {
            wrapper,
        });

        expect(screen.getByText('Standard Demo')).toBeInTheDocument();
    });

    it('renders correct title for financial accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} product='financial' />, { wrapper });

        expect(screen.getByText('Financial')).toBeInTheDocument();
    });

    it('renders correct title for demo financial accounts', () => {
        render(<CompareAccountsTitleIcon {...defaultProps} isDemo product='financial' />, {
            wrapper,
        });

        expect(screen.getByText('Financial Demo')).toBeInTheDocument();
    });
});
