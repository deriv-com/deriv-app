import React from 'react';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv-lib/stores';
import WalletsMigrationFailed from '../wallets-migration-failed';

jest.mock('@deriv-lib/components', () => ({
    ...jest.requireActual('@deriv-lib/components'),
}));

describe('<WalletsMigrationFailed />', () => {
    it('Should render the Modal', () => {
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

    it('Should not render the Modal if is_wallet_migration_failed is false', () => {
        const mockRootStore = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsMigrationFailed />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});
