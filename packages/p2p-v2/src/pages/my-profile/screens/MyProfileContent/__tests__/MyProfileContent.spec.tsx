import React from 'react';
import { useDevice } from '@/hooks';
import { render, screen } from '@testing-library/react';
import MyProfileContent from '../MyProfileContent';

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    AdvertiserName: () => <div>AdvertiserName</div>,
    AdvertiserNameToggle: () => <div>AdvertiserNameToggle</div>,
}));

jest.mock('../../MyProfileBalance', () => ({
    MyProfileBalance: () => <div>MyProfileBalance</div>,
}));

jest.mock('@/hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: false,
    })),
}));

describe('MyProfileContent', () => {
    it('should render the advertiser name and profile balance as expected in desktop', () => {
        render(<MyProfileContent />);
        expect(screen.getByText('AdvertiserName')).toBeInTheDocument();
        expect(screen.getByText('MyProfileBalance')).toBeInTheDocument();
    });
    it('should render the mobile view as expected', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<MyProfileContent />);
        expect(screen.getByText('AdvertiserNameToggle')).toBeInTheDocument();
    });
});
