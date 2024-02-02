import React from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import AdvertiserNameBadges from '../AdvertiserNameBadges';

const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
let mockUseAdvertiserStats = {
    data: {
        isAddressVerified: false,
        isIdentityVerified: false,
        totalOrders: 10,
    },
    isLoading: true,
};

jest.mock('../../../hooks', () => ({
    ...jest.requireActual('../../../hooks'),
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

describe('AdvertiserNameBadges', () => {
    it('should render loading', () => {
        mockUseAdvertiserStats = {
            data: {
                isAddressVerified: false,
                isIdentityVerified: false,
                totalOrders: 20,
            },
            isLoading: true,
        };
        render(<AdvertiserNameBadges />, { wrapper });
        expect(screen.queryByTestId('dt_p2p_v2_advertiser_name_badges')).not.toBeInTheDocument();
    });
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
