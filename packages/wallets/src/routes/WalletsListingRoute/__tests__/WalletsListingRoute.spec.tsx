import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../components/ModalProvider';
import WalletsListingRoute from '../WalletsListingRoute';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

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
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders DesktopWalletsList and WalletsAddMoreCarousel correctly on desktop', async () => {
        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletListHeader')).toBeInTheDocument();
        expect(screen.queryByText('WalletsCarousel')).not.toBeInTheDocument();
        expect(await screen.findByText('DesktopWalletsList')).toBeInTheDocument();
    });

    it('renders WalletsCarousel and WalletsAddMoreCarousel correctly on mobile', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletListHeader')).toBeInTheDocument();
        expect(screen.queryByText('DesktopWalletsList')).not.toBeInTheDocument();
        expect(await screen.findByText('WalletsCarousel')).toBeInTheDocument();
    });
});
