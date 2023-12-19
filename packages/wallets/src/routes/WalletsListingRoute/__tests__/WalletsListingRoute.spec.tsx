import React from 'react';
import { useActiveWalletAccount, useAuthorize, useWalletAccountsList } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../hooks/useDevice';
import WalletsListingRoute from '../WalletsListingRoute';

jest.mock('@deriv/api', () => ({
    useActiveWalletAccount: jest.fn(),
    useAuthorize: jest.fn(),
    useWalletAccountsList: jest.fn(),
}));

jest.mock('../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../components/', () => {
    return {
        DesktopWalletsList: () => <div>DesktopWalletsList</div>,
        WalletsAddMoreCarousel: () => <div>WalletsAddMoreCarousel</div>,
        WalletsCarousel: () => <div>WalletsCarousel</div>,
        WalletTourGuide: () => <div>WalletTourGuide</div>,
    };
});

describe('WalletsListingRoute', () => {
    let mockSwitchAccount: jest.Mock;

    beforeEach(() => {
        mockSwitchAccount = jest.fn();
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: null });
        (useAuthorize as jest.Mock).mockReturnValue({ switchAccount: mockSwitchAccount });
        (useWalletAccountsList as jest.Mock).mockReturnValue({ data: [{ loginid: '123' }] });
    });

    it('renders DesktopWalletsList, WalletsAddMoreCarousel and WalletTourGuide correctly on desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<WalletsListingRoute />);
        expect(screen.getByText('DesktopWalletsList')).toBeInTheDocument();
        expect(screen.getByText('WalletTourGuide')).toBeInTheDocument();
        expect(screen.queryByText('WalletsCarousel')).not.toBeInTheDocument();
    });

    it('renders WalletsCarousel and WalletsAddMoreCarousel correctly on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletsListingRoute />);
        expect(screen.queryByText('DesktopWalletsList')).not.toBeInTheDocument();
        expect(screen.getByText('WalletsCarousel')).toBeInTheDocument();
        expect(screen.queryByText('WalletTourGuide')).not.toBeInTheDocument();
    });

    it('calls switchAccount when there is no active wallet', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<WalletsListingRoute />);
        expect(mockSwitchAccount).toHaveBeenCalledWith('123');
    });

    it('does not call switchAccount when there is an active wallet', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { loginid: '123' } });

        render(<WalletsListingRoute />);
        expect(mockSwitchAccount).not.toHaveBeenCalled();
    });

    it('calls switchAccount with the first account when there is no active wallet', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useWalletAccountsList as jest.Mock).mockReturnValue({ data: [{ loginid: '123' }, { loginid: '456' }] });

        render(<WalletsListingRoute />);
        expect(mockSwitchAccount).toHaveBeenCalledWith('123');
        expect(mockSwitchAccount).not.toHaveBeenCalledWith('456');
    });
});
