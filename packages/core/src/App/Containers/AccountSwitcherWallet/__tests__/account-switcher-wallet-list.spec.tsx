import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccountSwitcherWalletList } from '../account-switcher-wallet-list';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('../account-switcher-wallet-item', () => ({
    AccountSwitcherWalletItem: () => <div>AccountSwitcherWalletItem</div>,
}));

const props: React.ComponentProps<typeof AccountSwitcherWalletList> = {
    wallets: [
        { loginid: 'CR007', dtrade_loginid: 'CR008' },
        { loginid: 'CR009', dtrade_loginid: 'CR010' },
        { loginid: 'CR011', dtrade_loginid: 'CR012' },
    ],
    closeAccountsDialog: jest.fn(),
};

describe('AccountSwitcherWalletList', () => {
    it('should render list items based on the number of wallets', () => {
        render(<AccountSwitcherWalletList {...props} />);
        expect(screen.getAllByText('AccountSwitcherWalletItem')).toHaveLength(3);
    });
});
