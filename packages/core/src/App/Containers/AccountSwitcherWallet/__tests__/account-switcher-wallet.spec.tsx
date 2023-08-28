import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import * as hooks from '@deriv/hooks';
import { TStores } from '@deriv/stores/types';
import AccountSwitcherWallet from '../account-switcher-wallet';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletAccountsList: jest.fn(() => ({ loginid: 'CR007', dtrade_loginid: 'CR008' })),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('../account-switcher-wallet-item', () => ({
    AccountSwitcherWalletItem: () => <div>AccountSwitcherWalletItem</div>,
}));

const props = {
    is_visible: true,
    toggle: jest.fn(),
} as React.ComponentProps<typeof AccountSwitcherWallet>;

let store: TStores;

const mock_store = {
    client: { switchAccount: jest.fn() },
    traders_hub: { setTogglePlatformType: jest.fn() },
    ui: { is_dark_mode_on: false },
};

beforeEach(() => {
    store = mockStore(mock_store);
    jest.spyOn(hooks, 'useWalletAccountsList').mockReturnValue({
        data: [{ loginid: 'CR007', dtrade_loginid: 'CR008' }],
    } as ReturnType<typeof hooks.useWalletAccountsList>);
});

const AccountSwitcherWalletComponent = (props: React.ComponentProps<typeof AccountSwitcherWallet>) => {
    return (
        <StoreProvider store={store}>
            <AccountSwitcherWallet {...props} />
        </StoreProvider>
    );
};

describe('AccountSwitcherWalletComponent', () => {
    it('should render the component', () => {
        render(<AccountSwitcherWalletComponent {...props} />);
        expect(screen.getByText('Deriv Apps accounts')).toBeInTheDocument();
        expect(screen.getByText('AccountSwitcherWalletItem')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Looking for CFDs? Go to Trader’s hub' })).toBeInTheDocument();
    });

    it('should render list items based on the number of wallets', () => {
        jest.spyOn(hooks, 'useWalletAccountsList').mockReturnValue({
            data: [
                { loginid: 'CR007', dtrade_loginid: 'CR008' },
                { loginid: 'CR009', dtrade_loginid: 'CR010' },
                { loginid: 'CR011', dtrade_loginid: 'CR012' },
            ],
        } as ReturnType<typeof hooks.useWalletAccountsList>);
        render(<AccountSwitcherWalletComponent {...props} />);
        expect(screen.getAllByText('AccountSwitcherWalletItem')).toHaveLength(3);
    });

    it('should toggle the switcher on button click', () => {
        render(<AccountSwitcherWalletComponent {...props} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(props.toggle).toHaveBeenCalledTimes(1);
    });
});
