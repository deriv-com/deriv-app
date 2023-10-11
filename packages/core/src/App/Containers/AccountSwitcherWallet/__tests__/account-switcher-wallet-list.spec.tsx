import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountSwitcherWalletList } from '../account-switcher-wallet-list';

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

const props: React.ComponentProps<typeof AccountSwitcherWalletList> = {
    wallets: [
        // @ts-expect-error don't want to send whole object
        { loginid: 'CR007', dtrade_loginid: 'CR008' },
        // @ts-expect-error don't want to send whole object
        { loginid: 'CR009', dtrade_loginid: 'CR010' },
        // @ts-expect-error don't want to send whole object
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
