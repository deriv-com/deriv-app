import React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';

import WalletsBannerUpgrade from '../wallets-banner-upgrade';
import WalletsBannerUpgrading from '../wallets-banner-upgrading';

import '@testing-library/jest-dom';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv-com/translations', () => ({
    ...jest.requireActual('@deriv-com/translations'),
    useTranslations: jest.fn(() => ({ instance: { dir: jest.fn() } })),
}));

describe('<WalletsBanner />', () => {
    const mockRootStore = mockStore({
        traders_hub: {
            toggleWalletsUpgrade: jest.fn(),
        },
    });

    describe('renders properly with right banner if status is eligible: <WalletsBannerUpgrade />', () => {
        const desktop_test_id = 'dt_wallets_upgrade_coins_horizontal';
        const mobile_test_id = 'dt_wallets_upgrade_coins';

        it('renders upgrade now button', async () => {
            render(<WalletsBannerUpgrade is_upgrading={false} />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const btn = screen.getByRole('button', { name: /Let's go/i });
            expect(btn).toBeInTheDocument();
        });

        it('renders image properly for desktop', () => {
            render(<WalletsBannerUpgrade is_upgrading={false} />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_test_id);
            const mobile_image = screen.queryByTestId(mobile_test_id);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('renders image properly for mobile', () => {
            (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
            render(<WalletsBannerUpgrade is_upgrading={false} />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_test_id);
            const mobile_image = screen.queryByTestId(mobile_test_id);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });

        it('disables "Let`s go" button when is_upgrading equals to true', () => {
            render(<WalletsBannerUpgrade is_upgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });

            const btn = screen.getByRole('button', { name: /Let's go/i });
            expect(btn).toBeDisabled();
        });
    });

    describe('renders properly with right banner if status is in_progress: <WalletsBannerUpgrading />', () => {
        const desktop_non_eu_test_id = 'dt_wallets_upgrade_coins_horizontal';
        const mobile_non_eu_test_id = 'dt_wallets_upgrade_coins';
        const desktop_eu_test_id = 'dt_wallets_eu_upgrade_coins_horizontal';
        const mobile_eu_test_id_ltr = 'dt_wallets_eu_upgrade_coins_ltr';
        const mobile_eu_test_id_rtl = 'dt_wallets_eu_upgrade_coins_rtl';

        it('renders right title', () => {
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const title = screen.queryByText(/We're setting up your Wallets/i);

            expect(title).toBeInTheDocument();
        });

        it('renders loading dots', () => {
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const loading_dots = screen.queryByTestId('dt_wallets_loading_dots');

            expect(loading_dots).toBeInTheDocument();
        });

        it('renders image properly for desktop non eu client', () => {
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_non_eu_test_id);
            const mobile_image = screen.queryByTestId(mobile_non_eu_test_id);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('renders image properly for mobile non eu client', () => {
            (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_non_eu_test_id);
            const mobile_image = screen.queryByTestId(mobile_non_eu_test_id);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });

        it('renders image properly for desktop eu client', () => {
            const mockedStore = {
                ...mockRootStore,
                client: {
                    is_eu: true,
                },
            };
            render(<WalletsBannerUpgrading />, {
                //@ts-expect-error - we need only partial client mock
                wrapper: ({ children }) => <StoreProvider store={mockedStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.getByTestId(desktop_eu_test_id);
            const mobile_image_ltr = screen.queryByTestId(mobile_eu_test_id_ltr);
            const mobile_image_rtl = screen.queryByTestId(mobile_eu_test_id_rtl);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image_ltr).not.toBeInTheDocument();
            expect(mobile_image_rtl).not.toBeInTheDocument();
        });

        it('renders image properly for mobile eu client in rtl language', () => {
            const mockedStore = {
                ...mockRootStore,
                client: {
                    is_eu: true,
                },
            };
            (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
            (useTranslations as jest.Mock).mockReturnValueOnce({ instance: { dir: jest.fn(() => 'rtl') } });
            render(<WalletsBannerUpgrading />, {
                //@ts-expect-error - we need only partial client mock
                wrapper: ({ children }) => <StoreProvider store={mockedStore}>{children}</StoreProvider>,
            });
            const mobile_image_rtl = screen.getByTestId(mobile_eu_test_id_rtl);

            expect(mobile_image_rtl).toBeInTheDocument();
        });

        it('renders image properly for mobile eu client in ltr language', () => {
            const mockedStore = {
                ...mockRootStore,
                client: {
                    is_eu: true,
                },
            };
            (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
            (useTranslations as jest.Mock).mockReturnValueOnce({ instance: { dir: jest.fn(() => 'ltr') } });
            render(<WalletsBannerUpgrading />, {
                //@ts-expect-error - we need only partial client mock
                wrapper: ({ children }) => <StoreProvider store={mockedStore}>{children}</StoreProvider>,
            });
            const mobile_image_ltr = screen.getByTestId(mobile_eu_test_id_ltr);

            expect(mobile_image_ltr).toBeInTheDocument();
        });
    });
});
