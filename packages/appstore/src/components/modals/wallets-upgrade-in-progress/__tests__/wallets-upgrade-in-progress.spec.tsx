import React from 'react';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import WalletsMigrationFailed from 'Components/modals/wallets-migration-failed';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
}));

describe('<WalletsMigrationFailed />', () => {
    test('Should render the Modal', () => {
        const mockRootStore = mockStore({
            traders_hub: {
                is_wallet_migration_failed: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsMigrationFailed />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    test('Should not render the Modal if is_wallet_migration_failed is false', () => {
        const mockRootStore = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsMigrationFailed />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});
