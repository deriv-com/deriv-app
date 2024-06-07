import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../components/ModalProvider';
import useDevice from '../../../hooks/useDevice';
import WalletsListingRoute from '../WalletsListingRoute';

jest.mock('../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../components', () => ({
    ...jest.requireActual('../../../components'),
    WalletListHeader: () => <div>WalletListHeader</div>,
    WalletsAddMoreCarousel: () => <div>WalletsAddMoreCarousel</div>,
    WalletTourGuide: () => <div>WalletTourGuide</div>,
}));

jest.mock('../../../components/DesktopWalletsList/DesktopWalletsList', () =>
    jest.fn(() => <div>DesktopWalletsList</div>)
);

jest.mock('../../../components/WalletsCarousel/WalletsCarousel', () => jest.fn(() => <div>WalletsCarousel</div>));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
    </APIProvider>
);

describe('WalletsListingRoute', () => {
    it('renders DesktopWalletsList, WalletsAddMoreCarousel and WalletTourGuide correctly on desktop', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletListHeader')).toBeInTheDocument();
        expect(screen.queryByText('WalletsCarousel')).not.toBeInTheDocument();
        expect(screen.getByText('WalletTourGuide')).toBeInTheDocument();
        expect(await screen.findByText('DesktopWalletsList')).toBeInTheDocument();
    });

    it('renders WalletsCarousel and WalletsAddMoreCarousel correctly on mobile', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletListHeader')).toBeInTheDocument();
        expect(screen.queryByText('DesktopWalletsList')).not.toBeInTheDocument();
        expect(await screen.findByText('WalletsCarousel')).toBeInTheDocument();
        expect(screen.queryByText('WalletTourGuide')).toBeInTheDocument();
    });
});
