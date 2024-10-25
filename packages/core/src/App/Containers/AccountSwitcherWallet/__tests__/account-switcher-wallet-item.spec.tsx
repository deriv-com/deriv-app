import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { AccountSwitcherWalletItem } from '../account-switcher-wallet-item';

// @ts-expect-error - This is a mock account
const account: React.ComponentProps<typeof AccountSwitcherWalletItem>['account'] = {
    currency: 'USD',
    dtrade_balance: 100,
    dtrade_loginid: 'CR007',
    gradients: {
        card: { dark: 'wallet-card__usd-bg--dark', light: 'wallet-card__usd-bg' },
        header: { dark: 'wallet-header__usd-bg--dark', light: 'wallet-header__usd-bg' },
    },
    icons: { dark: 'icons__dark', light: 'icons__light' },
    is_virtual: false,
    landing_company_name: 'svg',
    linked_to: [{ loginid: 'CR007', platform: 'dtrade' }],
    is_malta_wallet: false,
    balance: 0,
    created_at: undefined,
    excluded_until: undefined,
    is_disabled: false,
    loginid: '',
};

const props: React.ComponentProps<typeof AccountSwitcherWalletItem> = {
    closeAccountsDialog: jest.fn(),
    account,
    show_badge: false,
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

    it('should render Demo Badge if show_badge is true', () => {
        const store = mockStore({});
        const tempProps = { ...props, account: { ...account, is_virtual: true }, show_badge: true };
        render(<AccountSwitcherWalletItemComponent props={tempProps} store={store} />);
        expect(screen.getByText('Demo Wallet')).toBeInTheDocument();
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
        const store = mockStore({ client: { switchAccount, loginid: 'CR008' } });
        render(<AccountSwitcherWalletItemComponent props={props} store={store} />);
        userEvent.click(screen.getByTestId('account-switcher-wallet-item'));
        expect(switchAccount).toHaveBeenCalledWith('CR007');
        expect(props.closeAccountsDialog).toHaveBeenCalled();
    });

    it('should not call switchAccount when clicked the already selected', async () => {
        const switchAccount = jest.fn();
        const store = mockStore({ client: { switchAccount, loginid: 'CR007' } });
        render(<AccountSwitcherWalletItemComponent props={props} store={store} />);
        userEvent.click(screen.getByTestId('account-switcher-wallet-item'));
        expect(switchAccount).not.toHaveBeenCalled();
        expect(props.closeAccountsDialog).toHaveBeenCalled();
    });

    it('should show Options when is_eu is false', () => {
        const store = mockStore({
            client: {
                is_eu: false,
            },
        });
        const tempProps = { ...props, account };
        render(<AccountSwitcherWalletItemComponent props={tempProps} store={store} />);
        expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('should show Multipliers when is_eu is true', () => {
        const store = mockStore({
            client: {
                is_eu: true,
            },
        });
        const tempProps = { ...props, account };
        render(<AccountSwitcherWalletItemComponent props={tempProps} store={store} />);
        expect(screen.getByText('Multipliers')).toBeInTheDocument();
    });
});
