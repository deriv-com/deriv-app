import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletListCardDetails from '../WalletListCardDetails';

describe('WalletListCardDetails', () => {
    it('should render with active demo account details correctly', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails isActive isDemo loginid='VRW123456' title='USD' />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
    });

    it('should render with active real account details correctly', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails isActive isDemo={false} loginid='CRW123456' title='USD' />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });

    it('should render with inactive demo account details correctly', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails isActive={false} isDemo loginid='VRW123456' title='USD' />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.queryByText('Reset balance')).not.toBeInTheDocument();
    });

    it('should render with inactive real account details correctly', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails isActive={false} isDemo={false} loginid='CRW123456' title='USD' />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
        expect(screen.queryByText('Withdraw')).not.toBeInTheDocument();
    });

    it('should show badge if badge is provided', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails
                        badge='SVG'
                        isActive={false}
                        isDemo={false}
                        loginid='VRW123456'
                        title='USD'
                    />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('SVG')).toBeInTheDocument();
    });
});
