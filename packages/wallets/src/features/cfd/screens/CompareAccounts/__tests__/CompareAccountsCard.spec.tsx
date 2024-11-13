import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import { CFD_PLATFORMS, PRODUCT } from '../../../constants';
import CompareAccountsCard from '../CompareAccountsCard';

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('CompareAccountsCard', () => {
    const defaultProps = {
        isDemo: false,
        isEuRegion: false,
        isEuUser: false,
        marketType: 'financial' as const,
        platform: CFD_PLATFORMS.MT5,
        shortCode: 'SVG',
    };

    it('renders the component with default props', () => {
        render(<CompareAccountsCard {...defaultProps} />, { wrapper });

        expect(screen.getByText('MT5 Platform')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Maximum leverage')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
    });

    it('renders the new banner for Zero Spread platform', () => {
        render(<CompareAccountsCard {...defaultProps} platform={CFD_PLATFORMS.MT5} product={PRODUCT.ZEROSPREAD} />, {
            wrapper,
        });

        expect(screen.getByText('NEW')).toBeInTheDocument();
    });

    it('does not render the new banner for non Zero Spread platforms', () => {
        render(<CompareAccountsCard {...defaultProps} />, { wrapper });

        expect(screen.queryByText('NEW')).not.toBeInTheDocument();
    });

    it('renders the EU clients disclaimer for EU users', () => {
        render(<CompareAccountsCard {...defaultProps} isEuRegion={true} />, { wrapper });

        expect(screen.getByText('*Boom 300 and Crash 300 Index')).toBeInTheDocument();
    });

    it('does not render the EU clients disclaimer for non-EU users', () => {
        render(<CompareAccountsCard {...defaultProps} />, { wrapper });

        expect(screen.queryByText('*Boom 300 and Crash 300 Index')).not.toBeInTheDocument();
    });
});
