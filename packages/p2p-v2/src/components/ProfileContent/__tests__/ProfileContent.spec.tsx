import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import ProfileContent from '../ProfileContent';

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    AdvertiserName: () => <div>AdvertiserName</div>,
    AdvertiserNameToggle: () => <div>AdvertiserNameToggle</div>,
}));

jest.mock('../ProfileBalance', () => ({
    ProfileBalance: () => <div>ProfileBalance</div>,
}));

jest.mock('../ProfileStats', () => ({
    ProfileStats: () => <div>ProfileStats</div>,
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockUseDevice = useDevice as jest.Mock;

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

describe('ProfileContent', () => {
    it('should render the advertiser name and profile balance if location is my-profile', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://app.deriv.com/cashier/p2p-v2/my-profile',
            },
            writable: true,
        });
        render(<ProfileContent />, { wrapper });
        expect(screen.getByText('AdvertiserName')).toBeInTheDocument();
        expect(screen.getByText('ProfileBalance')).toBeInTheDocument();
    });

    it('should render the advertiser name and profile stats if location is advertiser', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://app.deriv.com/cashier/p2p-v2/advertiser',
            },
            writable: true,
        });
        render(<ProfileContent />, { wrapper });
        expect(screen.getByText('AdvertiserName')).toBeInTheDocument();
        expect(screen.getByText('ProfileStats')).toBeInTheDocument();
    });

    it('should render the AdvertiserNameToggle if isMobile is true and location is my-profile', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://app.deriv.com/cashier/p2p-v2/my-profile',
            },
            writable: true,
        });

        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(<ProfileContent />, { wrapper });
        expect(screen.getByText('AdvertiserNameToggle')).toBeInTheDocument();
    });
});
