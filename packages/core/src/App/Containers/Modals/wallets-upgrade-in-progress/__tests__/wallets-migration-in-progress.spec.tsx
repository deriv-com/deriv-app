import React from 'react';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import WalletsMigrationInProgress from '../wallets-migration-in-progress';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
}));

describe('<WalletsMigrationInProgress />', () => {
    test('Should render the Modal', () => {
        const mockRootStore = mockStore({
            client: {
                is_wallet_migration_in_progress_popup: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsMigrationInProgress />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    test('Should not render the Modal if is_wallet_migration_in_progress_popup is false', () => {
        const mockRootStore = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsMigrationInProgress />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});
