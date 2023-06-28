import React from 'react';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import WalletsUpgradeInProgress from '../wallets-upgrade-in-progress';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
}));

describe('<WalletsMigrationFailed />', () => {
    test('Should render the Modal', () => {
        const mockRootStore = mockStore({
            traders_hub: {
                is_wallet_upgrade_in_progress: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsUpgradeInProgress />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    test('Should not render the Modal if is_wallet_upgrade_in_progress is false', () => {
        const mockRootStore = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsUpgradeInProgress />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});
