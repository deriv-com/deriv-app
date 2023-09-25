import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useWalletAccountsList } from '@deriv/hooks';
import { AccountSwitcherWallet } from '../account-switcher-wallet';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletAccountsList: jest.fn(() => ({
        data: [{ loginid: 'CR007', dtrade_loginid: 'CR008' }],
    })),
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

const props: React.ComponentProps<typeof AccountSwitcherWallet> = {
    is_visible: true,
    toggle: jest.fn(),
};

const store = mockStore({});

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
        (useWalletAccountsList as jest.Mock).mockReturnValueOnce({
            data: [
                { loginid: 'CR007', dtrade_loginid: 'CR008' },
                { loginid: 'CR009', dtrade_loginid: 'CR010' },
                { loginid: 'CR011', dtrade_loginid: 'CR012' },
            ],
        });

        render(<AccountSwitcherWalletComponent {...props} />);
        expect(screen.getAllByText('AccountSwitcherWalletItem')).toHaveLength(3);
    });

    it('should toggle the switcher on button click', () => {
        render(<AccountSwitcherWalletComponent {...props} />);
        const button = screen.getByRole('button');
        userEvent.click(button);
        expect(props.toggle).toHaveBeenCalledTimes(1);
    });
});
