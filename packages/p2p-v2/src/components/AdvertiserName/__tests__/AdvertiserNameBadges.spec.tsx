import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import AdvertiserNameBadges from '../AdvertiserNameBadges';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);
let mockUseAdvertiserStats = {
    data: {
        isAddressVerified: false,
        isIdentityVerified: false,
        totalOrders: 10,
    },
    isLoading: false,
};

jest.mock('../../../hooks', () => ({
    ...jest.requireActual('../../../hooks'),
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

describe('AdvertiserNameBadges', () => {
    it('should render not verified badges', () => {
        mockUseAdvertiserStats = {
            data: {
                isAddressVerified: false,
                isIdentityVerified: false,
                totalOrders: 20,
            },
            isLoading: false,
        };
        render(<AdvertiserNameBadges />, { wrapper });
        expect(screen.queryAllByText('not verified')).toHaveLength(2);
    });
    it('should render verified badges', () => {
        mockUseAdvertiserStats = {
            data: {
                isAddressVerified: true,
                isIdentityVerified: true,
                totalOrders: 20,
            },
            isLoading: false,
        };
        render(<AdvertiserNameBadges />, { wrapper });
        expect(screen.queryAllByText('verified')).toHaveLength(2);
    });
    it('should render verified/not verified badges', () => {
        mockUseAdvertiserStats = {
            data: {
                isAddressVerified: true,
                isIdentityVerified: false,
                totalOrders: 20,
            },
            isLoading: false,
        };
        render(<AdvertiserNameBadges />, { wrapper });
        expect(screen.getByText('verified')).toBeInTheDocument();
        expect(screen.getByText('not verified')).toBeInTheDocument();
    });
    it('should render trade badge with 100+ orders', () => {
        mockUseAdvertiserStats = {
            data: {
                isAddressVerified: true,
                isIdentityVerified: false,
                totalOrders: 200,
            },
            isLoading: false,
        };
        render(<AdvertiserNameBadges />, { wrapper });
        expect(screen.getByText('100+')).toBeInTheDocument();
    });
});
