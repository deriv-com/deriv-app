import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider, useActiveWalletAccount, useIsEuRegion, useWalletAccountsList } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../components/ModalProvider';
import WalletsListingRoute from '../WalletsListingRoute';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(() => ({ data: { is_virtual: false } })),
    useIsEuRegion: jest.fn(() => ({ data: true })),
    useWalletAccountsList: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('../../../components', () => ({
    ...jest.requireActual('../../../components'),
    WalletListHeader: () => <div>WalletListHeader</div>,
    WalletsAddMoreCarousel: () => <div>WalletsAddMoreCarousel</div>,
    WalletsDisclaimerBanner: () => <div>WalletsDisclaimerBanner</div>,
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
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    currency: 'USD',
                    currency_config: { fractional_digits: 2 },
                    is_disabled: false,
                    is_virtual: false,
                    loginid: 'CR1',
                },
            ],
        });
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
        expect(screen.queryByText('WalletListHeader')).not.toBeInTheDocument();
        expect(screen.queryByText('DesktopWalletsList')).not.toBeInTheDocument();
        expect(await screen.findByText('WalletsCarousel')).toBeInTheDocument();
    });

    it('hides the wallet add more carousel if a user has added a wallet', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [{ is_added: true }],
        });
        render(<WalletsListingRoute />, { wrapper });
        expect(screen.queryByText('WalletsAddMoreCarousel')).not.toBeInTheDocument();
    });

    it('displays the wallet disclaimer banner if the user is in the EU region and has a non-virtual wallet', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true, isMobile: false });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: true });
        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletsDisclaimerBanner')).toBeInTheDocument();
    });

    it('does not display the wallet disclaimer banner if the user is in the EU region and the active wallet is a virtual wallet', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true, isMobile: false });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true } });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: true });
        render(<WalletsListingRoute />, { wrapper });
        expect(screen.queryByText('WalletsDisclaimerBanner')).not.toBeInTheDocument();
    });
});
