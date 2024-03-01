import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletListCardDetails from '../WalletListCardDetails';

describe('WalletListCardDetails', () => {
    it('should render with active demo account details correctly', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails
                        balance='10000'
                        isActive
                        isDemo
                        loginid='VRW123456'
                        onAccountSelect={jest.fn()}
                    />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
    });

    it('should render with active real account details correctly', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails
                        balance='10000'
                        isActive
                        isDemo={false}
                        loginid='CRW123456'
                        onAccountSelect={jest.fn()}
                    />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
    });

    it('should render with inactive demo account details correctly', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails
                        balance='10000'
                        isActive={false}
                        isDemo
                        loginid='VRW123456'
                        onAccountSelect={jest.fn()}
                    />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.queryByText('Reset balance')).not.toBeInTheDocument();
    });

    it('should render with inactive real account details correctly', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletListCardDetails
                        balance='10000'
                        isActive={false}
                        isDemo={false}
                        loginid='CRW123456'
                        onAccountSelect={jest.fn()}
                    />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
        expect(screen.queryByText('Withdraw')).not.toBeInTheDocument();
    });
});
