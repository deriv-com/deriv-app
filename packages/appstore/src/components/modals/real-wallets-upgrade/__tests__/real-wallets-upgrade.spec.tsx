import React from 'react';
import RealWalletsUpgrade from '../real-wallets-upgrade';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';

describe('<RealWalletsUpgrade />', () => {
    test('should render the Modal', async () => {
        const mock = mockStore({
            traders_hub: {
                is_real_wallets_upgrade_on: true,
                toggleWalletsUpgrade: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<RealWalletsUpgrade />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    test('should not render the Modal if is_real_wallets_upgrade_on is false', () => {
        const mock = mockStore({
            traders_hub: {
                is_real_wallets_upgrade_on: false,
                toggleWalletsUpgrade: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { container } = render(<RealWalletsUpgrade />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});
