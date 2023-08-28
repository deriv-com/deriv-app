import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { AccountSwitcherWalletItem } from '../account-switcher-wallet-item';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/shared'),
    useActiveAccount: jest.fn(() => ({ data: { loginid: 'CR007' } })),
}));

const account = {
    currency: 'USD',
    currency_config: { type: 'fiat', name: 'US dollar', display_code: 'USD' },
    dtrade_balance: 100,
    dtrade_loginid: 'CR007',
    gradients: {
        card: { dark: 'wallet-card__usd-bg--dark', light: 'wallet-card__usd-bg' },
        header: { dark: 'wallet-header__usd-bg--dark', light: 'wallet-header__usd-bg' },
    },
    icons: { dark: 'icons__dark', light: 'icons__light' },
    is_active: true,
    is_virtual: false,
    landing_company_name: 'svg',
    linked_to: [{ loginid: 'CR007' }],
} as unknown as React.ComponentProps<typeof AccountSwitcherWalletItem>['account'];

const props = {
    closeAccountsDialog: jest.fn(),
    switchAccount: jest.fn(),
    is_dark_mode_on: false,
    account,
} as unknown as React.ComponentProps<typeof AccountSwitcherWalletItem>;

let store: TStores;

const mock_store = {
    common: {},
    client: {
        switchAccount: jest.fn(),
    },
    ui: {
        is_dark_mode_on: false,
    },
};

beforeEach(() => {
    store = mockStore(mock_store);
});

const AccountSwitcherWalletItemComponent = (props: React.ComponentProps<typeof AccountSwitcherWalletItem>) => {
    return (
        <StoreProvider store={store}>
            <AccountSwitcherWalletItem {...props} />
        </StoreProvider>
    );
};

describe('AccountSwitcherWalletItem', () => {
    it('should render the component', () => {
        render(<AccountSwitcherWalletItemComponent {...props} />);
        expect(screen.getByText('US dollar')).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('should render Demo Badge if is_virtual flag true', () => {
        const tempProps = { ...props, account: { ...account, is_virtual: true } };
        render(<AccountSwitcherWalletItemComponent {...tempProps} />);
        expect(screen.getByText('US dollar')).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should call closeAccountsDialog when clicked', () => {
        render(<AccountSwitcherWalletItemComponent {...props} />);
        fireEvent.click(screen.getByTestId('account-switcher-wallet-item'));
        expect(props.closeAccountsDialog).toHaveBeenCalled();
    });

    it('should call switchAccount when clicked not selected', async () => {
        const switchAccount = jest.fn();
        store = mockStore({ ...mock_store, client: { switchAccount } });
        const tempProps = {
            ...props,
            account: {
                ...account,
                is_active: false,
                linked_to: [{ loginid: 'CR008' }],
            },
        };
        render(<AccountSwitcherWalletItemComponent {...tempProps} />);
        fireEvent.click(screen.getByTestId('account-switcher-wallet-item'));
        expect(switchAccount).toHaveBeenCalledWith('CR007');
        expect(props.closeAccountsDialog).toHaveBeenCalled();
    });

    it('should not call switchAccount when clicked the already selected', async () => {
        const switchAccount = jest.fn();
        store = mockStore({ ...mock_store, client: { switchAccount } });
        render(<AccountSwitcherWalletItemComponent {...props} />);
        fireEvent.click(screen.getByTestId('account-switcher-wallet-item'));
        expect(switchAccount).not.toHaveBeenCalled();
        expect(props.closeAccountsDialog).toHaveBeenCalled();
    });
});
