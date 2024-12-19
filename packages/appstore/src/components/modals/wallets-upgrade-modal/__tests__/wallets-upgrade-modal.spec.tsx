import React from 'react';

import { useGrowthbookGetFeatureValue, useWalletMigration } from '@deriv/hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WalletsUpgradeModal from '../wallets-upgrade-modal';

const mockStartMigration = jest.fn();

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletMigration: jest.fn(() => ({
        is_eligible: true,
        is_in_progress: false,
        is_migrating: false,
        startMigration: mockStartMigration,
    })),
    useGrowthbookGetFeatureValue: jest.fn(() => [false]),
}));

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    observer: jest.fn(x => x),
}));

describe('<WalletsUpgradeModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('shows modal if user is eligible for migration and is_wallet_modal_closed is not in sessionStorage', () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        const close_button = screen.getByTestId('dt_modal_close_icon');

        expect(screen.getByText('Introducing Wallets')).toBeInTheDocument();
        expect(screen.getByText('Enable now')).toBeInTheDocument();
        expect(close_button).toBeInTheDocument();
    });

    it('shows modal without close button for force migration if force migration is enabled and user is not migrating or in progress', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValueOnce([true]);
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        const close_button = screen.queryByTestId('dt_modal_close_icon');

        expect(screen.getByText('Introducing Wallets')).toBeInTheDocument();
        expect(screen.getByText('Enable now')).toBeInTheDocument();
        expect(close_button).not.toBeInTheDocument();
    });

    it('does not show modal if user is not eligible for migration', () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        (useWalletMigration as jest.Mock).mockImplementationOnce(() => ({
            is_eligible: false,
        }));

        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        expect(screen.queryByText('Enable now')).not.toBeInTheDocument();
    });

    it('does not show modal if is_wallet_modal_closed is in sessionStorage', () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        sessionStorage.setItem('is_wallet_migration_modal_closed', 'true');
        const isWalletMigrationModalClosed = sessionStorage.getItem('is_wallet_migration_modal_closed');

        jest.spyOn(React, 'useState').mockImplementationOnce(() => [!isWalletMigrationModalClosed, jest.fn()]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        expect(screen.queryByText('Enable now')).not.toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        const setModalOpen = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setModalOpen]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        const close_button = screen.getByTestId('dt_modal_close_icon');
        await userEvent.click(close_button);

        expect(setModalOpen).toHaveBeenCalledWith(false);
        expect(sessionStorage.getItem('is_wallet_migration_modal_closed')).toBe('true');
    });

    it('starts migration when Enable now button is clicked', async () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        const enable_now_button = screen.getByRole('button', { name: 'Enable now' });
        await userEvent.click(enable_now_button);

        expect(mockStartMigration).toHaveBeenCalled();
    });
});
