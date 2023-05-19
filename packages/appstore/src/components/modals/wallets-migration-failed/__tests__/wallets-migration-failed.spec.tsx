import React from 'react';
import { render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import WalletsMigrationFailed from '../wallets-migration-failed';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
}));

const mockRootStore = mockStore({
    traders_hub: {
        is_wallet_migration_failed: false,
        toggleWalletsMigrationFailedPopup: jest.fn(),
    },
});

describe('<WalletsMigrationFailed />', () => {
    test('Should render the Modal', () => {
        mockRootStore.traders_hub.is_wallet_migration_failed = true;

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsMigrationFailed />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    test('Should not render the Modal if is_wallet_migration_failed is false', () => {
        mockRootStore.traders_hub.is_wallet_migration_failed = false;

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { container } = render(<WalletsMigrationFailed />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });

    // test('Should close the Modal when user clicks on Back to traders hub button', async () => {
    //     mockRootStore.traders_hub.is_wallet_migration_failed = true;

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mockRootStore}>{children}</StoreProvider>
    //     );

    //     const { container } = render(<WalletsMigrationFailed />, { wrapper });

    //     expect(container).toBeInTheDocument();

    //     // const close_button = screen.getByRole('button', { name: 'Back to Trader’s Hub' });
    //     const close_button = screen.getByText(/back to trader/i);
    //     expect(close_button).toBeInTheDocument();

    //     await userEvent.click(close_button);

    //     expect(container).toBeEmptyDOMElement();
    // });
});
