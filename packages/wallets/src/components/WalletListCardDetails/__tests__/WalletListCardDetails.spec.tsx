import React from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import WalletListCardDetails from '../WalletListCardDetails';

describe('WalletListCardDetails', () => {
    it('should render with active demo account details correctly', () => {
        render(
            <APIProvider>
                <WalletListCardDetails isActive isDemo loginid='VRW123456' title='USD' />
            </APIProvider>
        );
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
    });

    it('should render with active real account details correctly', () => {
        render(
            <APIProvider>
                <WalletListCardDetails isActive isDemo={false} loginid='CRW123456' title='USD' />
            </APIProvider>
        );
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });

    it('should render with inactive demo account details correctly', () => {
        render(
            <APIProvider>
                <WalletListCardDetails isActive={false} isDemo loginid='VRW123456' title='USD' />
            </APIProvider>
        );
        expect(screen.queryByText('Reset balance')).not.toBeInTheDocument();
    });

    it('should render with inactive real account details correctly', () => {
        render(
            <APIProvider>
                <WalletListCardDetails isActive={false} isDemo={false} loginid='CRW123456' title='USD' />
            </APIProvider>
        );
        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
        expect(screen.queryByText('Withdraw')).not.toBeInTheDocument();
    });

    it('should show badge if badge is provided', () => {
        render(
            <APIProvider>
                <WalletListCardDetails badge='SVG' isActive={false} isDemo={false} loginid='VRW123456' title='USD' />
            </APIProvider>
        );
        expect(screen.getByText('SVG')).toBeInTheDocument();
    });
});
