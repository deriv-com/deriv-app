import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { AccountSwitcherWalletItem } from '../account-switcher-wallet-item';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useActiveAccount: jest.fn(() => ({ data: { loginid: 'CR007' } })),
}));

const account: React.ComponentProps<typeof AccountSwitcherWalletItem>['account'] = {
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
    wallet_currency_type: '',
    is_malta_wallet: false,
    is_demo: false,
    is_selected: false,
    gradient_header_class: 'wallet-header__usd-bg',
    gradient_card_class: 'wallet-card__usd-bg',
    icon: '',
    balance: 0,
    created_at: undefined,
    excluded_until: undefined,
    is_disabled: false,
    is_trading: false,
    is_wallet: false,
    loginid: '',
};

const props: React.ComponentProps<typeof AccountSwitcherWalletItem> = {
    closeAccountsDialog: jest.fn(),
    account,
};

const AccountSwitcherWalletItemComponent = ({
    props,
    store,
}: {
    props: React.ComponentProps<typeof AccountSwitcherWalletItem>;
    store: ReturnType<typeof mockStore>;
}) => {
    return (
        <StoreProvider store={store}>
            <AccountSwitcherWalletItem {...props} />
        </StoreProvider>
    );
};

describe('AccountSwitcherWalletItem', () => {
    it('should render the component', () => {
        const store = mockStore({});
        render(<AccountSwitcherWalletItemComponent props={props} store={store} />);
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });

    it('should NOT show SVG badge', () => {
        const store = mockStore({});
        render(<AccountSwitcherWalletItemComponent props={props} store={store} />);
        expect(screen.queryByText('SVG')).not.toBeInTheDocument();
    });

    it('should show MALTA badge', () => {
        const store = mockStore({});
        const tempProps = { ...props, account: { ...account, is_malta_wallet: true, landing_company_name: 'malta' } };
        render(<AccountSwitcherWalletItemComponent props={tempProps} store={store} />);
        expect(screen.getByText('MALTA')).toBeInTheDocument();
    });

    it('should render Demo Badge if is_virtual flag true', () => {
        const store = mockStore({});
        const tempProps = { ...props, account: { ...account, is_virtual: true } };
        render(<AccountSwitcherWalletItemComponent props={tempProps} store={store} />);
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should call closeAccountsDialog when clicked', () => {
        const store = mockStore({});
        render(<AccountSwitcherWalletItemComponent props={props} store={store} />);
        userEvent.click(screen.getByTestId('account-switcher-wallet-item'));
        expect(props.closeAccountsDialog).toHaveBeenCalled();
    });

    it('should call switchAccount when clicked not selected', async () => {
        const switchAccount = jest.fn();
        const store = mockStore({ client: { switchAccount } });
        const tempProps = {
            ...props,
            account: {
                ...account,
                is_active: false,
                linked_to: [{ loginid: 'CR008' }],
            },
        };
        render(<AccountSwitcherWalletItemComponent props={tempProps} store={store} />);
        userEvent.click(screen.getByTestId('account-switcher-wallet-item'));
        expect(switchAccount).toHaveBeenCalledWith('CR007');
        expect(props.closeAccountsDialog).toHaveBeenCalled();
    });

    it('should not call switchAccount when clicked the already selected', async () => {
        const switchAccount = jest.fn();
        const store = mockStore({ client: { switchAccount } });
        render(<AccountSwitcherWalletItemComponent props={props} store={store} />);
        userEvent.click(screen.getByTestId('account-switcher-wallet-item'));
        expect(switchAccount).not.toHaveBeenCalled();
        expect(props.closeAccountsDialog).toHaveBeenCalled();
    });
});
