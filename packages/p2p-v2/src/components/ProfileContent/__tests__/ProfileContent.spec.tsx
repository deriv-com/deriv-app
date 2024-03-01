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
    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://app.deriv.com/cashier/p2p-v2/my-profile',
            },
            writable: true,
        });
    });

    it('should render the advertiser name and profile balance as expected in desktop', () => {
        render(<ProfileContent />, { wrapper });
        expect(screen.getByText('AdvertiserName')).toBeInTheDocument();
        expect(screen.getByText('ProfileBalance')).toBeInTheDocument();
    });

    it('should render the mobile view as expected', () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(<ProfileContent />, { wrapper });
        expect(screen.getByText('AdvertiserNameToggle')).toBeInTheDocument();
    });
});
