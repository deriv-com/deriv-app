import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { isMobile } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TImageTestID } from 'Assets/svgs/wallets/image-types';
import WalletsBanner from '../wallets-banner';
import WalletsBannerUpgrade from '../wallets-banner-upgrade';
import WalletsBannerUpgrading from '../wallets-banner-upgrading';
import WalletsBannerReady from '../wallets-banner-ready';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

describe('<WalletsBanner />', () => {
    describe('Should render properly with right banner if status is eligible: <WalletsBannerUpgrade />', () => {
        const desktop: TImageTestID = 'dt_upgrade_desktop';
        const mobile: TImageTestID = 'dt_upgrade_mobile';
        const mockRootStore = mockStore({ traders_hub: { toggleWalletsUpgrade: true } });

        render(<WalletsBanner />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        it('Should render right button', () => {
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const btn = screen.queryByText('Upgrade now');

            expect(btn).toBeInTheDocument();
        });

        it('Should render image properly for desktop', () => {
            isMobile.mockReturnValue(false);
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile', () => {
            isMobile.mockReturnValue(true);
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });
    });

    describe('Should render properly with right banner if status is in_progress: <WalletsBannerUpgrading />', () => {
        const desktop: TImageTestID = 'dt_upgrading_desktop';
        const mobile: TImageTestID = 'dt_upgrading_mobile';
        const desktop_eu: TImageTestID = 'dt_upgrading_desktop_eu';
        const mobile_eu: TImageTestID = 'dt_upgrading_mobile_eu';

        it('Should render right title', () => {
            render(<WalletsBannerUpgrading />);
            const title = screen.queryByText(/We're setting up your Wallets/i);

            expect(title).toBeInTheDocument();
        });

        it('Should render loading dots', () => {
            render(<WalletsBannerUpgrading />);
            const loading_dots = screen.queryByTestId('dt_wallets-loading-dots');

            expect(loading_dots).toBeInTheDocument();
        });

        it('Should render image properly for desktop for Non-EU', () => {
            isMobile.mockReturnValue(false);
            render(<WalletsBannerUpgrading />);
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile for Non-EU', () => {
            isMobile.mockReturnValue(true);
            render(<WalletsBannerUpgrading />);
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });

        it('Should render image properly for desktop for EU', () => {
            isMobile.mockReturnValue(false);
            render(<WalletsBannerUpgrading is_eu={true} />);
            const desktop_image = screen.queryByTestId(desktop_eu);
            const mobile_image = screen.queryByTestId(mobile_eu);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile for EU', () => {
            isMobile.mockReturnValue(true);
            render(<WalletsBannerUpgrading is_eu={true} />);
            const desktop_image = screen.queryByTestId(desktop_eu);
            const mobile_image = screen.queryByTestId(mobile_eu);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });
    });

    describe('Should render properly with right banner if status is migrated: <WalletsBannerReady />', () => {
        const desktop: TImageTestID = 'dt_ready_desktop';
        const mobile: TImageTestID = 'dt_ready_mobile';
        const desktop_eu: TImageTestID = 'dt_ready_desktop_eu';
        const mobile_eu: TImageTestID = 'dt_ready_mobile_eu';
        const mocked_root_store = mockStore({});

        it('Should render right title', () => {
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletsBannerReady />
                </StoreProvider>
            );
            const title = screen.queryByText(/Your Wallets are ready/i);

            expect(title).toBeInTheDocument();
        });

        it('Should render tick', () => {
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletsBannerReady />
                </StoreProvider>
            );
            const tick = screen.queryByTestId('dt_wallets-ready-tick');

            expect(tick).toBeInTheDocument();
        });

        it('Should render right button', () => {
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletsBannerReady />
                </StoreProvider>
            );
            const btn = screen.queryByText('Log out');

            expect(btn).toBeInTheDocument();
        });

        it('Should render image properly for desktop for Non-EU', () => {
            isMobile.mockReturnValue(false);
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletsBannerReady />
                </StoreProvider>
            );
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile for Non-EU', () => {
            isMobile.mockReturnValue(true);
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletsBannerReady />
                </StoreProvider>
            );
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });

        it('Should render image properly for desktop for EU', () => {
            isMobile.mockReturnValue(false);
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletsBannerReady is_eu={true} />
                </StoreProvider>
            );
            const desktop_image = screen.queryByTestId(desktop_eu);
            const mobile_image = screen.queryByTestId(mobile_eu);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile for EU', () => {
            isMobile.mockReturnValue(true);
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletsBannerReady is_eu={true} />
                </StoreProvider>
            );
            const desktop_image = screen.queryByTestId(desktop_eu);
            const mobile_image = screen.queryByTestId(mobile_eu);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });

        it('Should call logout function when click on button', async () => {
            render(
                <StoreProvider store={mocked_root_store}>
                    <WalletsBannerReady />
                </StoreProvider>
            );

            const btn = screen.getByText('Log out');

            await userEvent.click(btn);

            expect(btn).toBeInTheDocument();
            expect(mocked_root_store.client.logout).toBeCalledTimes(1);
        });
    });
});
